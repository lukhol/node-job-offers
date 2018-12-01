const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UserController');
const auth = require('../middlewares/checkAuth');

router.post('/login', UsersController.login);
router.post('/register', UsersController.register);
router.delete('/:id', auth, UsersController.delete);
router.get("/:id", UsersController.getById);

module.exports = router;