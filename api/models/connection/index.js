const mongoose = require('mongoose');
const config = require('../../../config');
let dbConnectionUrl = '';

process.env.NODE_ENV = 'local';

mongoose.set('useCreateIndex', true);

switch (process.env.NODE_ENV) {
    case 'local':
        dbConnectionUrl = `mongodb://${config.dbLocal.host}:${config.dbLocal.port}/${config.dbLocal.database}`;
        break;
    case 'development':
        dbConnectionUrl = `mongodb://${config.dbDev.username}:${config.dbDev.password}@${config.dbDev.host}:${config.dbDev.port}/${config.dbDev.database}?authSource=${config.dbDev.authSource}`;
        break;
    case 'production':
        dbConnectionUrl = `mongodb://${config.dbProd.username}:${config.dbProd.password}@${config.dbProd.host}:${config.dbProd.port}/${config.dbProd.database}?authSource=${config.dbProd.authSource}`;
        break;
    case 'test':
        dbConnectionUrl = `mongodb://${config.dbTest.username}:${config.dbTest.password}@${config.dbTest.host}:${config.dbTest.port}/${config.dbTest.database}`;
        break;
    default:
        dbConnectionUrl = `mongodb://${config.dbLocal.host}:${config.dbLocal.port}/${config.dbLocal.database}`;
}

try {
    mongoose.connect(`${dbConnectionUrl}`, { useNewUrlParser: true },d => {
        console.log(`Connected to ${process.env.NODE_ENV} database: `,`${dbConnectionUrl}`);
    }); // connect to our database
} catch (err) {
    console.log('DBCONNECT ERROR', err);
}
module.exports = mongoose;