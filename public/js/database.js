const Datastore = require('nedb');
let database = {};
database.rotinas = new Datastore({ filename: './db/rotinas' });
module.exports = database;