const express = require('express');

const UserController = require('./../../../Controller/auth/user/userController');
const router = express.Router();

router.post('/createorder', UserController.createOrder);

router.post('/user/gettoken', UserController.getToken);
router.post('/user/verifytoken', UserController.verifyToken);

router.post('/user/register', UserController.RegisterAdmin);
router.post('/user/login', UserController.loginAdmin);

router.get('/user',UserController.getUsers);
router.get('/user/:userId', UserController.getUserById);


router.put('/user/:userId', UserController.updateUser);


module.exports = router;