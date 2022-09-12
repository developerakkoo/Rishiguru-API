const express = require('express');

const rechargeController = require('../../Controller/recharge/rechargeController');

const router = express.Router();

router.get('/recharge', rechargeController.getAllRecharge);

router.get('/recharge/:id', rechargeController.getRechargeById);

router.get('/recharge/stats/get', rechargeController.getStats);

router.post('/recharge', rechargeController.addRecharge);

router.delete('/recharge/:id', rechargeController.deleteRecharge);

module.exports = router;