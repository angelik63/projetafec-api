const express = require('express');
const router = express.Router();
const planteController = require('../controllers/planteController');
const auth = require('../middleware/auth');
const uploadPhoto = require('../middleware/multer'); // ← Vérifiez cette ligne

// POST /api/plantes - Créer une plante
router.post('/', uploadPhoto,auth, planteController.create);
//                      ↑ multer doit être ici

// PUT /api/plantes/:id - Modifier une plante
router.put('/:id', uploadPhoto,  auth, planteController.update);

// Les autres routes sans multer
router.get('/', auth, planteController.getAll);
router.get('/:id', auth, planteController.getOne);
router.delete('/:id', auth, planteController.delete);
router.patch('/:id/arroser', auth, planteController.arroser);

module.exports = router;