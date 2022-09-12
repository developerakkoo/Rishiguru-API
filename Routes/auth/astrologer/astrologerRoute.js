const express = require('express');

const astrologerController = require('../../../Controller/auth/astrologer/astrologerAuthController');


const router = express.Router();

router.post('/astrologer/login', astrologerController.loginAstrologer);

router.post('/astrologer/register', astrologerController.RegisterAstrologer);

router.get('/astrologer/:id', astrologerController.getAstrologerById);
router.get('/astrologer/', astrologerController.getAllAstrologers);

router.put('/astrologer/:id', astrologerController.updateAstrologer);

router.delete('/astrologer/:id', astrologerController.deleteAstrologer);


module.exports = router;