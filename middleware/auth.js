const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Récupérer le token dans le header Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Accès refusé. Token manquant.' 
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    
    // Ajouter l'userId à la requête
    req.userId = decoded.userId;
    req.userPseudo = decoded.pseudo;
    
    // Continuer vers la route suivante
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token invalide ou expiré.' 
    });
  }
};

module.exports = auth;