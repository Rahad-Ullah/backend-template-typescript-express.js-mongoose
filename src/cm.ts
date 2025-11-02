import fs from 'fs';
import path from 'path';

function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toUpperCase() : match.toLowerCase()
    )
    .replace(/\s+/g, '');
}

type Templates = {
  interface: string;
  model: string;
  controller: string;
  service: string;
  route: string;
  validation: string;
  constants: string;
};

function createModule(name: string): void {
  const camelCaseName = toCamelCase(name);
  const folderName = camelCaseName.toLowerCase();
  const folderPath = path.join(__dirname, 'app', 'modules', folderName);

  // Check if the folder already exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Created folder: ${folderName}`);
  } else {
    console.log(`Folder ${folderName} already exists.`);
    return;
  }

  const templates: Templates = {
    interface: `import { Model } from 'mongoose';\n\nexport type I${camelCaseName} = {\n  // Define the interface for ${camelCaseName} here\n};\n\nexport type ${camelCaseName}Model = Model<I${camelCaseName}>;\n`,
    model: `import { Schema, model } from 'mongoose';\nimport { I${camelCaseName}, ${camelCaseName}Model } from './${folderName}.interface'; \n\nconst ${folderName}Schema = new Schema<I${camelCaseName}, ${camelCaseName}Model>({\n  // Define schema fields here\n});\n\nexport const ${camelCaseName} = model<I${camelCaseName}, ${camelCaseName}Model>('${camelCaseName}', ${folderName}Schema);\n`,
    controller: `import { Request, Response, NextFunction } from 'express';\nimport { ${camelCaseName}Services } from './${folderName}.service';\n\nexport const ${camelCaseName}Controller = { };\n`,
    service: `import { ${camelCaseName}Model } from './${folderName}.interface';\n\nexport const ${camelCaseName}Services = { };\n`,
    route: `import express from 'express';\nimport { ${camelCaseName}Controller } from './${folderName}.controller';\n\nconst router = express.Router();\n\nrouter.get('/', ${camelCaseName}Controller); \n\nexport const ${camelCaseName}Routes = router;\n`,
    validation: `import { z } from 'zod';\n\nexport const ${camelCaseName}Validations = {  };\n`,
    constants: `export const ${camelCaseName.toUpperCase()}_CONSTANT = 'someValue';\n`,
  };

  Object.entries(templates).forEach(([key, content]) => {
    const filePath = path.join(folderPath, `${folderName}.${key}.ts`);
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  });

  // Add the new module to the central `apiRoutes` array
  updateRouterFile(folderName, camelCaseName);
}

// Get the module name from command line arguments
const moduleName: string | undefined = process.argv[2];
if (!moduleName) {
  console.log(
    'Please provide a module name, e.g., node generateModule UserProfile'
  );
} else {
  createModule(moduleName);
}

/**
 * Updates the central router file by adding a new module route import and entry.
 *
 * @param folderName - The name of the folder/module (in lowercase or kebab-case).
 * @param camelCaseName - The camelCase name of the module (used for route import/export).
 */
function updateRouterFile(folderName: string, camelCaseName: string): void {
  const routerPath = path.join(__dirname, 'app/routes', 'index.ts');
  const routeImport = `import { ${camelCaseName}Routes } from '../app/modules/${folderName}/${folderName}.route';`;
  const routeEntry = `{ path: '/${folderName}', route: ${camelCaseName}Routes }`;

  let routerFileContent = fs.readFileSync(routerPath, 'utf-8');

  // Check if the import statement is already present
  if (!routerFileContent.includes(routeImport)) {
    routerFileContent = `${routeImport}\n${routerFileContent}`;
  }

  // Find the `apiRoutes` array and update it
  const apiRoutesRegex =
    /export const apiRoutes: \{ path: string; route: any \}\[] = \[([\s\S]*?)\]/;
  const match = routerFileContent.match(apiRoutesRegex);

  if (match) {
    const currentRoutes = match[1].trim();
    if (!currentRoutes.includes(routeEntry)) {
      const updatedRoutes = currentRoutes
        ? `${currentRoutes}\n  ${routeEntry}`
        : `${routeEntry}`;
      routerFileContent = routerFileContent.replace(
        apiRoutesRegex,
        `export const apiRoutes: { path: string; route: any }[] = [\n  ${updatedRoutes}\n]`
      );
    }
  } else {
    console.error(
      'Failed to find apiRoutes array. Ensure the app.ts file has a properly defined apiRoutes array.'
    );
    return;
  }

  // Write the updated content back to the `app.ts` file
  fs.writeFileSync(routerPath, routerFileContent, 'utf-8');
  console.log(`✅ Added route for ${camelCaseName} to central router.`);
}
