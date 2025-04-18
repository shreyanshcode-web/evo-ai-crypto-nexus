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
const BASE_URL = "https://pro-api.coinmarketcap.com/v1";

// Function to fetch cryptocurrency data from CoinMarketCap
export const fetchTopCryptos = async (limit: number = 10): Promise<CryptoData[]> => {
  try {
    const response = await axios.get<CoinMarketCapResponse>(
      `${BASE_URL}/cryptocurrency/listings/latest`,
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
    
    console.log("CoinMarketCap API Response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    // Fallback to mock data only if there's an error
    return mockCryptoData.slice(0, limit);
  }
};

// Function to get historical data for a specific cryptocurrency
export const getHistoricalPriceData = async (symbol: string, days: number = 7) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/cryptocurrency/quotes/historical`,
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
    // Fallback to mock data only if there's an error
    const crypto = mockCryptoData.find(c => c.symbol === symbol);
    const basePrice = crypto ? crypto.quote.USD.price : 100;
    return generateMockHistoricalData(basePrice, days);
  }
};

// Sample mock data for development when API is not available
const mockCryptoData: CryptoData[] = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    slug: "bitcoin",
    quote: {
      USD: {
        price: 66789.53,
        volume_24h: 25463789543,
        percent_change_1h: 0.25,
        percent_change_24h: 2.56,
        percent_change_7d: -1.45,
        market_cap: 1304563789012,
      },
    },
  },
  {
    id: 1027,
    name: "Ethereum",
    symbol: "ETH",
    slug: "ethereum",
    quote: {
      USD: {
        price: 3245.87,
        volume_24h: 12567890123,
        percent_change_1h: 0.15,
        percent_change_24h: 1.87,
        percent_change_7d: -2.34,
        market_cap: 389567890123,
      },
    },
  },
  {
    id: 52,
    name: "XRP",
    symbol: "XRP",
    slug: "xrp",
    quote: {
      USD: {
        price: 0.5423,
        volume_24h: 1987654321,
        percent_change_1h: -0.12,
        percent_change_24h: -1.45,
        percent_change_7d: 3.21,
        market_cap: 28976543210,
      },
    },
  },
  {
    id: 1839,
    name: "Binance Coin",
    symbol: "BNB",
    slug: "binance-coin",
    quote: {
      USD: {
        price: 607.23,
        volume_24h: 1765432198,
        percent_change_1h: 0.32,
        percent_change_24h: 1.23,
        percent_change_7d: 4.56,
        market_cap: 93214567890,
      },
    },
  },
  {
    id: 825,
    name: "Tether",
    symbol: "USDT",
    slug: "tether",
    quote: {
      USD: {
        price: 1.0001,
        volume_24h: 56789012345,
        percent_change_1h: 0.01,
        percent_change_24h: 0.02,
        percent_change_7d: -0.01,
        market_cap: 83245678901,
      },
    },
  },
  {
    id: 3408,
    name: "USD Coin",
    symbol: "USDC",
    slug: "usd-coin",
    quote: {
      USD: {
        price: 0.9998,
        volume_24h: 3254678901,
        percent_change_1h: -0.01,
        percent_change_24h: 0.01,
        percent_change_7d: 0.02,
        market_cap: 43765890123,
      },
    },
  },
  {
    id: 74,
    name: "Dogecoin",
    symbol: "DOGE",
    slug: "dogecoin",
    quote: {
      USD: {
        price: 0.1234,
        volume_24h: 987654321,
        percent_change_1h: 1.23,
        percent_change_24h: 5.67,
        percent_change_7d: -3.45,
        market_cap: 16543890123,
      },
    },
  },
  {
    id: 3890,
    name: "Polygon",
    symbol: "MATIC",
    slug: "polygon",
    quote: {
      USD: {
        price: 0.5678,
        volume_24h: 765432198,
        percent_change_1h: 0.45,
        percent_change_24h: 2.34,
        percent_change_7d: -1.23,
        market_cap: 5432198765,
      },
    },
  },
  {
    id: 5426,
    name: "Solana",
    symbol: "SOL",
    slug: "solana",
    quote: {
      USD: {
        price: 142.56,
        volume_24h: 3456789012,
        percent_change_1h: 0.76,
        percent_change_24h: 4.32,
        percent_change_7d: 8.76,
        market_cap: 64321987654,
      },
    },
  },
  {
    id: 4172,
    name: "Cardano",
    symbol: "ADA",
    slug: "cardano",
    quote: {
      USD: {
        price: 0.3789,
        volume_24h: 543219876,
        percent_change_1h: -0.32,
        percent_change_24h: -1.54,
        percent_change_7d: 2.34,
        market_cap: 13289076543,
      },
    },
  },
];

// Generate mock historical data
const generateMockHistoricalData = (basePrice: number, days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Random price fluctuation within 5%
    const randomFactor = 0.95 + Math.random() * 0.1;
    const price = basePrice * randomFactor * (1 + (days - i) * 0.01);
    
    data.push({
      date: date.toISOString(),
      price: price
    });
  }
  
  return data;
};

// Function to get data for a specific cryptocurrency
export const fetchCryptoDetails = async (id: number): Promise<CryptoData | null> => {
  try {
    // Using mock data due to API connectivity issues
    const crypto = mockCryptoData.find(c => c.id === id);
    if (crypto) {
      return crypto;
    }
    
    /* Uncomment this when API connection is working
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
    */
    
    return null;
  } catch (error) {
    console.error(`Error fetching details for crypto ID ${id}:`, error);
    // Return mock data as fallback
    const crypto = mockCryptoData.find(c => c.id === id);
    return crypto || null;
  }
};
