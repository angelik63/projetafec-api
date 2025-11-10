const express = require('express');
const router = express.Router();
const planteController = require('../controllers/planteController');
const auth = require('../middleware/auth');
const uploadPhoto = require('../middleware/multer'); 

router.post('/', uploadPhoto,auth, planteController.create);

router.put('/:id', uploadPhoto,  auth, planteController.update);

router.get('/', auth, planteController.getAll);
router.get('/:id', auth, planteController.getOne);
router.delete('/:id', auth, planteController.delete);
router.patch('/:id/arroser', auth, planteController.arroser);

module.exports = router;