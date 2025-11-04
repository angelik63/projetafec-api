const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dossier de destination
const UPLOAD_DIR = path.join(__dirname, '../uploads/plantes');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = 'plante_' + Date.now() + '_' + Math.floor(Math.random() * 1000) + extension;
        cb(null, filename);
    }
});

// Filtre simplifié
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false); // ← Ne pas rejeter, juste ignorer
    }
};

// Configuration multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Exporter avec gestion d'erreur
module.exports = (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Erreur multer
            return res.status(400).json({ 
                success: false, 
                message: `Erreur upload: ${err.message}` 
            });
        } else if (err) {
            // Autre erreur
            return res.status(500).json({ 
                success: false, 
                message: `Erreur serveur: ${err.message}` 
            });
        }
        // Tout va bien, continuer
        next();
    });
};