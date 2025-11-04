const Plante = require('../models/Plante');
const LIEUX_VALIDES = ['interieur', 'exterieur', 'potager'];


// Créer une plante
exports.create = (req, res) => {
  if (!req.body) {
         // Vous pouvez renvoyer une erreur 400 ou laisser le 500 si vous n'avez pas confiance dans le message.
         // Mais le crash est évité.
         return res.status(500).json({ success: false, message: "Erreur critique d'analyse des données (Multer/Body Parser)." });
    }
    
  const { nom, description, lieu, date_semis, date_arrosage } = req.body;
  const user_id = req.userId; // Vient du middleware auth
  const photo = req.file ? req.file.filename : null; // Photo uploadée

  // Vérifier que le nom est rempli
  if (!nom) {
    return res.status(400).json({ 
      success: false, 
      message: 'Le nom de la plante est obligatoire' 
    });
  }

// 2. NOUVELLE VALIDATION : Vérifier si le lieu est valide
    if (!lieu || !LIEUX_VALIDES.includes(lieu)) {
        return res.status(400).json({
            success: false,
            message: 'Lieu invalide. Les lieux acceptés sont: interieur, exterieur, potager.'
        });
    }

  // Créer la plante
  Plante.create(
    { user_id, nom, description, photo, lieu, date_semis, date_arrosage },
    (err, result) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur lors de l\'ajout de la plante' 
        });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Plante ajoutée avec succès',
        plante: { id: result.id, nom, description, photo, lieu, date_semis, date_arrosage }
      });
    }
  );
};

// Récupérer toutes les plantes de l'utilisateur
exports.getAll = (req, res) => {
  const user_id = req.userId;

  Plante.findByUserId(user_id, (err, plantes) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des plantes' 
      });
    }

    res.json({ 
      success: true, 
      plantes 
    });
  });
};

// Récupérer une plante spécifique
exports.getOne = (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  Plante.findOne(id, user_id, (err, plante) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }

    if (!plante) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plante non trouvée' 
      });
    }

    res.json({ 
      success: true, 
      plante 
    });
  });
};

// Mettre à jour une plante
exports.update = (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;
  const { nom, description, lieu, date_semis, date_arrosage } = req.body;
  const photo = req.file ? req.file.filename : req.body.photo;

  Plante.update(
    id, 
    user_id, 
    { nom, description, photo, lieu, date_semis, date_arrosage },
    (err, result) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur lors de la modification' 
        });
      }

      if (result.changes === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Plante non trouvée' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Plante modifiée avec succès' 
      });
    }
  );
};

// Supprimer une plante
exports.delete = (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  Plante.delete(id, user_id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la suppression' 
      });
    }

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plante non trouvée' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Plante supprimée avec succès' 
    });
  });
}; // <-- Fin de exports.delete

// Mettre à jour la date d'arrosage
exports.arroser = (req, res) => {
    const { id } = req.params; // ID de la plante à arroser
    const user_id = req.userId; // ID de l'utilisateur connecté
    
    // Récupérer la date actuelle (format lisible par la DB)
    const date_arrosage = new Date().toISOString(); 

    // NOTE: On suppose que la méthode static arroser(id, user_id, date_arrosage, callback)
    // est présente dans votre modèle models/Plante.js.
    Plante.arroser(id, user_id, date_arrosage, (err, result) => {
        if (err) {
            console.error("Erreur DB lors de l'arrosage:", err.message);
            return res.status(500).json({ 
                success: false, 
                message: "Erreur serveur lors de la mise à jour de l'arrosage." 
            });
        }
        
        if (result.changes === 0) {
            // Aucune plante trouvée avec cet ID appartenant à cet utilisateur
            return res.status(404).json({ 
                success: false, 
                message: "Plante non trouvée ou non autorisée." 
            });
        }

        // Succès
        res.json({ 
            success: true, 
            message: `Plante ID ${id} arrosée avec succès.`,
            date_arrosage: date_arrosage
        });
    });
}; // <-- Fin de exports.arroser (Ceci termine le fichier proprement)