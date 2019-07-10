'use strict';
const path = require('path');
const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);


let server;
const main = () => {

    // await some DB initialize
    const app = require('src/app.js');
    const port = config.get('port');

    server = app.listen(port, () => {
        console.log(`${config.get('service')} listening on ${port}`);
    })
}


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
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
