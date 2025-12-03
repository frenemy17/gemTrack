const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getMarketRates, getMarketNews } = require('../controllers/marketController');

router.get('/rates', protect, getMarketRates);
router.get('/news', protect, getMarketNews);

module.exports = router;