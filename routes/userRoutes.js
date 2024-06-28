const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/worko/user', userController.getAllUsers);
router.get('/worko/user/:userId', userController.getUserById);
router.post('/worko/user', userController.createUser);
router.put('/worko/user/:userId', userController.updateUser);
router.patch('/worko/user/:userId', userController.updateUser);
router.delete('/worko/user/:userId', userController.softDeleteUser);

module.exports = router;
