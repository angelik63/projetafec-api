
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/arrosomoi.db');


const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur de connexion:', err.message);
  } else {
    console.log('Connexion à SQLite réussie');
  }
});

module.exports = db;