const msgController = require('./../../Controller/message/messageController');

const express = require('express');

const router = express.Router();


// router.get('/msg', msgController.getAllMessages);
router.get('/msg/:id', msgController.getMessageByRoomId);

router.post('/msg', msgController.createMessage);

router.delete('/msg/:roomId', msgController.deleteMessageByRoomId);


module.exports = router;