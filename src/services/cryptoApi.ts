
import axios from "axios";

interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      market_cap: number;
    };
  };
}

interface CoinMarketCapResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
  data: CryptoData[];
}

// API Key for CoinMarketCap
const API_KEY = "21b1412d-3ca3-4a54-b4d9-e8a4f62d7969";

// Function to fetch cryptocurrency data from CoinMarketCap
export const fetchTopCryptos = async (limit: number = 10): Promise<CryptoData[]> => {
  try {
    const response = await axios.get<CoinMarketCapResponse>(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        params: {
          start: 1,
          limit: limit,
          convert: "USD",
        },
        headers: {
          "X-CMC_PRO_API_KEY": API_KEY,
          "Accept": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    return [];
  }
};

// Function to get data for a specific cryptocurrency
export const fetchCryptoDetails = async (id: number): Promise<CryptoData | null> => {
  try {
    const response = await axios.get<any>(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      {
        params: {
          id: id,
          convert: "USD",
        },
        headers: {
          "X-CMC_PRO_API_KEY": API_KEY,
          "Accept": "application/json",
        },
      }
    );
    return response.data.data[id];
  } catch (error) {
    console.error(`Error fetching details for crypto ID ${id}:`, error);
    return null;
  }
};

// Function to get historical data
export const getHistoricalPriceData = async (symbol: string, days: number = 7) => {
  try {
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical`,
      {
        params: {
          symbol: symbol,
          interval: days <= 1 ? '1h' : '1d',
          count: days <= 1 ? 24 : days,
          convert: 'USD'
        },
        headers: {
          "X-CMC_PRO_API_KEY": API_KEY,
          "Accept": "application/json",
        },
      }
    );

    // Format the data for the chart
    const data = response.data.data[symbol].quotes.map((quote: any) => ({
      date: quote.timestamp,
      price: quote.quote.USD.price
    }));

    return data;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    // Return empty array on error
    return [];
  }
};
