import fs from 'fs';
import path from 'path';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_ ]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toConstantCase(str: string): string {
  return str
    .replace(/[-\s]+/g, '_') // convert - and spaces to _
    .replace(/([a-z])([A-Z])/g, '$1_$2') // camelCase → snake_case
    .toUpperCase();
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
  const pascalName = toPascalCase(name); // JobSeeker
  const camelName = toCamelCase(name); // jobSeeker
  const constantName = toConstantCase(name); // JOB_SEEKER
  const folderName = camelName; // jobSeeker

  const folderPath = path.join(__dirname, 'app', 'modules', folderName);

  // Create folder
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Created folder: ${folderName}`);
  } else {
    console.log(`Folder ${folderName} already exists.`);
    return;
  }

  const templates: Templates = {
    interface: `import { Model } from 'mongoose';

export type I${pascalName} = {
  // Define the interface for ${pascalName} here
};

export type ${pascalName}Model = Model<I${pascalName}>;`,

    model: `import { Schema, model } from 'mongoose';
import { I${pascalName}, ${pascalName}Model } from './${folderName}.interface';

const ${camelName}Schema = new Schema<I${pascalName}, ${pascalName}Model>({
  // Define schema fields here
});

export const ${pascalName} = model<I${pascalName}, ${pascalName}Model>(
  '${pascalName}',
  ${camelName}Schema
);`,

    controller: `import { Request, Response, NextFunction } from 'express';
import { ${pascalName}Services } from './${folderName}.service';

export const ${pascalName}Controller = {
  // Controller methods here
};`,

    service: `import { I${pascalName} } from './${folderName}.interface';

export const ${pascalName}Services = {
  // Service methods here
};`,

    route: `import express from 'express';
import { ${pascalName}Controller } from './${folderName}.controller';

const router = express.Router();

router.get('/', ${pascalName}Controller);

export const ${camelName}Routes = router;`,

    validation: `import { z } from 'zod';

export const ${pascalName}Validations = {
  // Zod validation schemas
};`,

    constants: `export const ${constantName}_CONSTANT = 'someValue';`,
  };

  Object.entries(templates).forEach(([key, content]) => {
    const filePath = path.join(folderPath, `${folderName}.${key}.ts`);
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  });

  updateRouterFile(folderName, camelName);
}

const moduleName: string | undefined = process.argv[2];
if (!moduleName) {
  console.log(
    'Please provide a module name, e.g., node generateModule userProfile'
  );
} else {
  createModule(moduleName);
}

function updateRouterFile(folderName: string, camelName: string): void {
  const routerPath = path.join(__dirname, 'routes', 'index.ts');

  const routeImport = `import { ${camelName}Routes } from '../app/modules/${folderName}/${folderName}.route';`;
  const pluralPath = `/${folderName.toLowerCase()}s`;
  const routeEntry = `{ path: '${pluralPath}', route: ${camelName}Routes }`;

  let routerFileContent = fs.readFileSync(routerPath, 'utf-8');

  if (!routerFileContent.includes(routeImport)) {
    routerFileContent = `${routeImport}\n${routerFileContent}`;
  }

  const apiRoutesRegex = /const apiRoutes\s*=\s*\[((.|\s)*?)\];/m;

  const match = routerFileContent.match(apiRoutesRegex);

  if (match) {
    const currentRoutes = match[1].trim();

    if (!currentRoutes.includes(routeEntry)) {
      const updatedRoutes = currentRoutes
        ? `${currentRoutes}\n  ${routeEntry}`
        : `${routeEntry}`;

      routerFileContent = routerFileContent.replace(
        apiRoutesRegex,
        `const apiRoutes: { path: string; route: any }[] = [\n  ${updatedRoutes}\n]`
      );
    }
  } else {
    console.error(
      'Failed to find apiRoutes array. Ensure index.ts has a properly defined apiRoutes array.'
    );
    return;
  }

  fs.writeFileSync(routerPath, routerFileContent, 'utf-8');
  console.log(`✅ Added route for ${camelName} to central router.`);
}
