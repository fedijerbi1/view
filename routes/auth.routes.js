const express = require('express');
const router = express.Router();
const { login, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth.middleware');

// Route login (publique)
router.post('/login', login);

// Route changer mot de passe (protégée - token requis)
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
