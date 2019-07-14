'use strict';
const path = require('path');
const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);

const config = require('src/util/config.js');
const db = require('@xentreprise/cloud-db');

let server;
const main = async () => {
  // await some DB initialize
  // await db.initialize(
  //   config.get('database_url'),
  //   config.get('db'),
  //   console.log
  // );
  console.log('Database Initialized');


  const app = require('src/app.js');

  const port = config.get('port');

  server = app.listen(port, () => {
    console.log(`${config.get('service')} listening on ${port}`);

    const bot = require('src/bot.js');
    const MessageHandler = require('src/api/handlers/MessageHandler.js');
    const handler = new MessageHandler();
    bot.on('message', (args) => {
      handler.handle(args);
    });
  });
};


const gracefulShutdown = () => {
  server.close(async () => {
    // await some DB shut down
    console.log(`${config.get('service')} is gracefully shutting down`);
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (err) => {
  console.log('Unhandled promise rejection!', err);
  process.exit(1);
});


main()
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
