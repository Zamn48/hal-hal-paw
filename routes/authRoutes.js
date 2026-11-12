const express = require('express');
const router = express.Router();
const c = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', c.register); // Menghubungkan alamat register dengan fungsi register
router.post('/login', c.login); // Menghubungkan alamat login dengan fungsi login
router.get('/me', verifyToken, c.me);

module.exports = router;