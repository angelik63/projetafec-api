const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Créer un utilisateur
  static create({ pseudo, email, password }, callback) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run(
      'INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)',
      [pseudo, email, hashedPassword],
      function(err) {
        if (err) return callback(err, null);
        callback(null, { id: this.lastID, pseudo, email });
      }
    );
  }

  // Trouver par pseudo ou email
  static findByLogin(login, callback) {
    db.get(
      'SELECT * FROM users WHERE pseudo = ? OR email = ?',
      [login, login],
      callback
    );
  }

  // Trouver par ID
  static findById(id, callback) {
    db.get(
      'SELECT id, pseudo, email, created_at FROM users WHERE id = ?',
      [id],
      callback
    );
  }

  // Vérifier si pseudo existe
  static pseudoExists(pseudo, callback) {
    db.get(
      'SELECT id FROM users WHERE pseudo = ?',
      [pseudo],
      (err, row) => {
        if (err) return callback(err, null);
        callback(null, !!row);
      }
    );
  }

  // Vérifier si email existe
  static emailExists(email, callback) {
    db.get(
      'SELECT id FROM users WHERE email = ?',
      [email],
      (err, row) => {
        if (err) return callback(err, null);
        callback(null, !!row);
      }
    );
  }

  // Comparer les mots de passe
  static comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

module.exports = User;