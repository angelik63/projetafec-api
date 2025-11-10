const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Accès refusé. Token manquant.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    
    req.userId = decoded.userId;
    req.userPseudo = decoded.pseudo;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token invalide ou expiré.' 
    });
  }
};

module.exports = auth;