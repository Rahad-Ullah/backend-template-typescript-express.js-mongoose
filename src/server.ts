import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { seedSuperAdmin } from './DB/seedAdmin';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';

//uncaught exception
import process from 'process';

process.on('uncaughtException', error => {
  errorLogger.error('UnhandleException Detected', error);
  process.exit(1);
});

let server: any;
async function main() {
  logger.info(colors.yellow('🚀 Server is starting...'));
  try {
    mongoose.connect(config.database_url as string);
    logger.info(colors.green('✅ Database connected successfully'));

    //Seed Super Admin after database connection is successful
    await seedSuperAdmin();

    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);

    server = app.listen(port, config.ip_address as string, () => {
      logger.info(colors.yellow(`📶 Application listening on port:${port}`));
    });

    //socket
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });
    socketHelper.socket(io);
  //@ts-ignore
    global.io = io;
  } catch (error) {
    console.error(error)
    errorLogger.error(colors.red('🤢 Failed to connect Database'));
  }

  //handle unhandleRejection
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('UnhandleRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

// handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server...');
  if (server) {
    server.close(() => {
      logger.info('Server closed. Exiting process.');
      process.exit(0); // Explicitly kill the process after cleanup
    });
  } else {
    process.exit(0);
  }
});

// handle SIGINT
process.on('SIGINT', () => {
  logger.info('SIGINT received. Exiting...');
  process.exit(0);
});
