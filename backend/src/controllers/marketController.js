// backend/src/controllers/marketController.js
const axios = require('axios');

// @route   GET /api/market/rates
// @desc    Get live metal market rates
// @access  Private
exports.getMarketRates = async (req, res) => {
  try {
    // Use the provided API key directly
    const apiKey = 'goldapi-3gssmipo4jj7-io';

    const config = {
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json'
      },
      maxRedirects: 5
    };

    // Fetch Gold (XAU) and Silver (XAG) in INR
    const [goldResponse, silverResponse] = await Promise.all([
      axios.get("https://www.goldapi.io/api/XAU/INR", config),
      axios.get("https://www.goldapi.io/api/XAG/INR", config)
    ]);

    const goldData = goldResponse.data;
    const silverData = silverResponse.data;

    // Helper to safely parse rate
    const parseRate = (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    const gold24k = parseRate(goldData.price_gram_24k);
    const gold22k = parseRate(goldData.price_gram_22k);
    const silver24k = parseRate(silverData.price_gram_24k);

    if (gold24k !== null && gold22k !== null && silver24k !== null) {
      const realData = {
        success: true,
        base_currency: "INR",
        timestamp: new Date().toISOString(),
        rates: {
          gold_24k_10gm: (gold24k * 10).toFixed(2),
          gold_22k_10gm: (gold22k * 10).toFixed(2),
          silver_1kg: (silver24k * 1000).toFixed(2),
          platinum_1gm: 3200.00
        }
      };
      return res.json(realData);
    }

    console.warn("GoldAPI returned incomplete data.");
    return res.json({
      success: false,
      message: "Failed to fetch complete market data",
      rates: null
    });
  } catch (error) {
    console.error('Error fetching market rates:', error.message);
    // Return null rates on error instead of mock data
    res.json({
      success: false,
      message: "Error fetching market rates",
      rates: null
    });
  }
};

// @route   GET /api/market/news
// @route   GET /api/market/news
// @desc    Get jewelry industry news
// @access  Private
exports.getMarketRates = async (req, res) => {
  // ... existing code ...
};

exports.getMarketNews = async (req, res) => {
  try {
    const newsData = [
      {
        id: 1,
        title: "Gold prices stabilize ahead of wedding season",
        source: "Financial Express",
        date: new Date().toISOString().split('T')[0],
        summary: "Demand for yellow metal is expected to rise significantly..."
      },
      {
        id: 2,
        title: "New Hallmarking rules: What jewelers need to know",
        source: "Jewelry Standard",
        date: "2023-10-26",
        summary: "The government has mandated 6-digit HUID for all gold jewelry..."
      },
      {
        id: 3,
        title: "Silver imports hit 5-year high in Q3",
        source: "Market Watch",
        date: "2023-10-25",
        summary: "Industrial demand coupled with investment buying pushes imports..."
      }
    ];
    res.json(newsData);
  } catch (error) {
    console.error("Error fetching market news", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
};