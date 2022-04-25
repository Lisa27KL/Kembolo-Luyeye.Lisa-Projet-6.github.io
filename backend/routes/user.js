const express = require('express');
const passwordValidator = require('../middleware/passwordValidator');
const router = express.Router();
const userCtrl = require('../controllers/user');
const limiter = require('../middleware/rate-limiter');

// Routers for user
router.post('/signup',passwordValidator, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;