const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
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

  static findByLogin(login, callback) {
    db.get(
      'SELECT * FROM users WHERE pseudo = ? OR email = ?',
      [login, login],
      callback
    );
  }

  static findById(id, callback) {
    db.get(
      'SELECT id, pseudo, email, created_at FROM users WHERE id = ?',
      [id],
      callback
    );
  }

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

  static comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

module.exports = User;