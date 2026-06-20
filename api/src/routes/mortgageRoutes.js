const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/mortgageController');

router.post('/inquiry', submitInquiry);

module.exports = router;
