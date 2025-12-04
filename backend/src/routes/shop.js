const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/', shopController.getProfile);
router.put('/', shopController.updateProfile);

module.exports = router;
