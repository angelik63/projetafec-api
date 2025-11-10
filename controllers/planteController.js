const Plante = require('../models/Plante');
const LIEUX_VALIDES = ['interieur', 'exterieur', 'potager'];


exports.create = (req, res) => {
  if (!req.body) {
         return res.status(500).json({ success: false, message: "Erreur critique d'analyse des données (Multer/Body Parser)." });
    }
    
  const { nom, description, lieu, date_semis, date_arrosage } = req.body;
  const user_id = req.userId; 
  const photo = req.file ? req.file.filename : null; 


  if (!nom) {
    return res.status(400).json({ 
      success: false, 
      message: 'Le nom de la plante est obligatoire' 
    });
  }

    if (!lieu || !LIEUX_VALIDES.includes(lieu)) {
        return res.status(400).json({
            success: false,
            message: 'Lieu invalide. Les lieux acceptés sont: interieur, exterieur, potager.'
        });
    }

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
};


exports.arroser = (req, res) => {
    const { id } = req.params; 
    const user_id = req.userId; 
    
       const date_arrosage = new Date().toISOString(); 

    Plante.arroser(id, user_id, date_arrosage, (err, result) => {
        if (err) {
            console.error("Erreur DB lors de l'arrosage:", err.message);
            return res.status(500).json({ 
                success: false, 
                message: "Erreur serveur lors de la mise à jour de l'arrosage." 
            });
        }
        
        if (result.changes === 0) {
                        return res.status(404).json({ 
                success: false, 
                message: "Plante non trouvée ou non autorisée." 
            });
        }
        res.json({ 
            success: true, 
            message: `Plante ID ${id} arrosée avec succès.`,
            date_arrosage: date_arrosage
        });
    });
}; 