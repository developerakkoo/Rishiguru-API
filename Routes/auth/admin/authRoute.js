const express = require('express');

const authAdminController = require('../../../Controller/auth/admin/adminAuthController');


const router = express.Router();

router.post('/admin/login', authAdminController.loginAdmin);

router.post('/admin/register', authAdminController.RegisterAdmin);

router.get('/admin/:id', authAdminController.getAdminById);

router.put('/admin/:id', authAdminController.updateAdmin);

router.delete('/admin/:id', authAdminController.deleteAdmin);


module.exports = router;