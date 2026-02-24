const express = require('express');
const router = express.Router();
const { getDevelopers, getDeveloper } = require('../controllers/developerController');

router.get('/', getDevelopers);
router.get('/:slug', getDeveloper);

module.exports = router;
