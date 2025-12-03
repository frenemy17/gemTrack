import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOLDAPI_KEY = 'goldapi-16vzcc19miolmfyg-io';
const GOLDAPI_URL = 'https://www.goldapi.io/api';

export const fetchGoldRates = async () => {
  try {
    const cached = await AsyncStorage.getItem('goldRates');
    if (cached) {
      const {data, timestamp} = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }

    const response = await axios.get(`${GOLDAPI_URL}/XAU/USD`, {
      headers: {'x-access-token': GOLDAPI_KEY},
    });

    const usdToInr = 83;
    const gold24kUsd = response.data.price_gram_24k;
    const gold24k = Math.round(gold24kUsd * usdToInr);
    const gold22k = Math.round(gold24k * 0.916);
    const silver = Math.round(gold24k * 0.015);

    const rates = {gold24k, gold22k, silver};

    await AsyncStorage.setItem('goldRates', JSON.stringify({data: rates, timestamp: Date.now()}));
    return rates;
  } catch (error) {
    console.log('GoldAPI Error:', error.message);
    return {gold24k: 6500, gold22k: 5950, silver: 85};
  }
};
