const db = require('./db');


function initDatabase() {
  console.log('Initialisation de la base de données...');

  // Table users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pseudo TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erreur table users:', err.message);
    } else {
      console.log('Table users prête');
    }
  });

  // Table plantes
  db.run(`
    CREATE TABLE IF NOT EXISTS plantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      nom TEXT NOT NULL,
      description TEXT,
      photo TEXT,
      lieu TEXT,
      date_semis DATE,
      date_arrosage DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Erreur table plantes:', err.message);
    } else {
      console.log('Table plantes prête');
    }
  });

  console.log('Initialisation terminée !');
}

module.exports = initDatabase;