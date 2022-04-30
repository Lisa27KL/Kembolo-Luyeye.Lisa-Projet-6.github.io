const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const authorization = require("../middleware/authorization");
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

// Routers for sauces
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, authorization, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, authorization, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);

module.exports = router;