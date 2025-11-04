const db = require('../config/db');

class Plante {
  // Créer une plante
  static create({ user_id, nom, description, photo, lieu, date_semis, date_arrosage }, callback) {
    db.run(
      `INSERT INTO plantes (user_id, nom, description, photo, lieu, date_semis, date_arrosage) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, nom, description, photo, lieu, date_semis, date_arrosage],
      function(err) {
        if (err) return callback(err, null);
        callback(null, { id: this.lastID });
      }
    );
  }

  // Récupérer toutes les plantes d'un utilisateur
  static findByUserId(user_id, callback) {
    db.all(
      'SELECT * FROM plantes WHERE user_id = ? ORDER BY created_at DESC',
      [user_id],
      callback
    );
  }

  // Récupérer une plante
  static findOne(id, user_id, callback) {
    db.get(
      'SELECT * FROM plantes WHERE id = ? AND user_id = ?',
      [id, user_id],
      callback
    );
  }

  // Mettre à jour une plante
  static update(id, user_id, data, callback) {
    const { nom, description, photo, lieu, date_semis, date_arrosage } = data;
    
    db.run(
      `UPDATE plantes 
       SET nom = ?, description = ?, photo = ?, lieu = ?, date_semis = ?, date_arrosage = ?
       WHERE id = ? AND user_id = ?`,
      [nom, description, photo, lieu, date_semis, date_arrosage, id, user_id],
      function(err) {
        if (err) return callback(err, null);
        callback(null, { changes: this.changes });
      }
    );
  }

  // Supprimer une plante
  static delete(id, user_id, callback) {
    db.run(
      'DELETE FROM plantes WHERE id = ? AND user_id = ?',
      [id, user_id],
      function(err) {
        if (err) return callback(err, null);
        callback(null, { changes: this.changes });
      }
    );
  }
}

module.exports = Plante;