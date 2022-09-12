const roomController = require('./../../Controller/room/room');

const express = require('express');

const router = express.Router();


router.get('/room', roomController.getRoom);
router.get('/room/:id', roomController.getRoomById);

router.post('/room', roomController.createRoom);

router.delete('/room/:id', roomController.deleteRoom);


module.exports = router;