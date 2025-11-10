const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.register = (req, res) => {
  const { pseudo, email, password } = req.body;
  
  if (!pseudo || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Tous les champs sont obligatoires' 
    });
  }
 
  User.pseudoExists(pseudo, (err, exists) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }

    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ce pseudo est déjà utilisé' 
      });
    }

  
    User.emailExists(email, (err, exists) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur serveur' 
        });
      }

      if (exists) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cet email est déjà utilisé' 
        });
      }

      
      User.create({ pseudo, email, password }, (err, user) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la création du compte' 
          });
        }

        res.status(201).json({ 
          success: true, 
          message: 'Compte créé avec succès',
          user: { id: user.id, pseudo: user.pseudo, email: user.email }
        });
      });
    });
  });
};

exports.login = (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Pseudo/email et mot de passe requis' 
    });
  }

  User.findByLogin(login, (err, user) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur' 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants incorrects' 
      });
    }

    const isPasswordValid = User.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants incorrects' 
      });
    }

    const token = jwt.sign(
      { userId: user.id, pseudo: user.pseudo },
      process.env.JWT_SECRET || 'votre_secret_key',
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true, 
      message: 'Connexion réussie',
      token,
      user: { id: user.id, pseudo: user.pseudo, email: user.email }
    });
  });
};


exports.getProfile = (req, res) => {
  
  User.findById(req.userId, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.json({ 
      success: true, 
      user 
    });
  });
};