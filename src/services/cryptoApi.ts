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
const BASE_URL = "https://sandbox-api.coinmarketcap.com";

// Sample data for development/testing
const sampleCryptoData: CryptoData[] = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    slug: "bitcoin",
    quote: {
      USD: {
        price: 63542.12,
        volume_24h: 23456789012,
        percent_change_1h: 0.45,
        percent_change_24h: 2.34,
        percent_change_7d: -1.23,
        market_cap: 1234567890123
      }
    }
  },
  {
    id: 1027,
    name: "Ethereum",
    symbol: "ETH",
    slug: "ethereum",
    quote: {
      USD: {
        price: 3521.67,
        volume_24h: 12345678901,
        percent_change_1h: 0.21,
        percent_change_24h: 1.45,
        percent_change_7d: -3.56,
        market_cap: 423456789012
      }
    }
  },
  {
    id: 1839,
    name: "Binance Coin",
    symbol: "BNB",
    slug: "binance-coin",
    quote: {
      USD: {
        price: 613.24,
        volume_24h: 1234567890,
        percent_change_1h: -0.15,
        percent_change_24h: 0.78,
        percent_change_7d: -2.45,
        market_cap: 93456789012
      }
    }
  },
  {
    id: 52,
    name: "XRP",
    symbol: "XRP",
    slug: "xrp",
    quote: {
      USD: {
        price: 0.5423,
        volume_24h: 2345678901,
        percent_change_1h: 0.12,
        percent_change_24h: -0.56,
        percent_change_7d: -4.32,
        market_cap: 25456789012
      }
    }
  },
  {
    id: 74,
    name: "Dogecoin",
    symbol: "DOGE",
    slug: "dogecoin",
    quote: {
      USD: {
        price: 0.1423,
        volume_24h: 1234567890,
        percent_change_1h: 1.23,
        percent_change_24h: 5.67,
        percent_change_7d: 10.89,
        market_cap: 18456789012
      }
    }
  },
  {
    id: 1958,
    name: "Tron",
    symbol: "TRX",
    slug: "tron",
    quote: {
      USD: {
        price: 0.1123,
        volume_24h: 987654321,
        percent_change_1h: 0.34,
        percent_change_24h: 1.56,
        percent_change_7d: 3.45,
        market_cap: 10123456789
      }
    }
  },
  {
    id: 2010,
    name: "Cardano",
    symbol: "ADA",
    slug: "cardano",
    quote: {
      USD: {
        price: 0.4523,
        volume_24h: 876543210,
        percent_change_1h: -0.45,
        percent_change_24h: -2.34,
        percent_change_7d: -5.67,
        market_cap: 15987654321
      }
    }
  },
  {
    id: 3408,
    name: "USD Coin",
    symbol: "USDC",
    slug: "usd-coin",
    quote: {
      USD: {
        price: 1.0012,
        volume_24h: 9876543210,
        percent_change_1h: 0.01,
        percent_change_24h: 0.05,
        percent_change_7d: -0.03,
        market_cap: 32123456789
      }
    }
  },
  {
    id: 5426,
    name: "Solana",
    symbol: "SOL",
    slug: "solana",
    quote: {
      USD: {
        price: 149.67,
        volume_24h: 3456789012,
        percent_change_1h: 0.78,
        percent_change_24h: 3.45,
        percent_change_7d: 8.90,
        market_cap: 59876543210
      }
    }
  },
  {
    id: 3890,
    name: "Polygon",
    symbol: "MATIC",
    slug: "polygon",
    quote: {
      USD: {
        price: 0.6743,
        volume_24h: 765432109,
        percent_change_1h: 1.23,
        percent_change_24h: 4.56,
        percent_change_7d: 9.87,
        market_cap: 6234567890
      }
    }
  }
];

// Historical price data for charts (mock data)
export const getHistoricalPriceData = (symbol: string, days: number = 7) => {
  // Generate random historical data based on the number of days
  const data = [];
  let basePrice;
  
  // Set a realistic base price based on the cryptocurrency
  switch(symbol.toUpperCase()) {
    case 'BTC':
      basePrice = 60000;
      break;
    case 'ETH':
      basePrice = 3500;
      break;
    case 'BNB':
      basePrice = 600;
      break;
    case 'XRP':
      basePrice = 0.50;
      break;
    case 'DOGE':
      basePrice = 0.14;
      break;
    default:
      basePrice = 100;
  }
  
  // Generate data points for each day
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    // Calculate date
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Generate a realistic price with some random variation
    const randomFactor = 0.98 + Math.random() * 0.04; // between 0.98 and 1.02
    const price = basePrice * randomFactor;
    basePrice = price; // Update base price to create a somewhat realistic trend
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: price
    });
    
    // For intraday data, add multiple data points per day
    if (days <= 1) {
      for (let h = 1; h <= 23; h++) {
        if (i === 0 && h > now.getHours()) {
          break;
        }
        const hourDate = new Date(date);
        hourDate.setHours(h);
        const hourlyRandomFactor = 0.995 + Math.random() * 0.01;
        const hourlyPrice = price * hourlyRandomFactor;
        data.push({
          date: hourDate.toISOString().split('.')[0],
          price: hourlyPrice
        });
      }
    }
  }
  
  return data;
};

// Function to mock CoinMarketCap API call
export const fetchTopCryptos = async (limit: number = 10): Promise<CryptoData[]> => {
  try {
    // For development, return mock data
    const mockData = sampleCryptoData.slice(0, limit);
    return mockData;

    // In production, make an actual API call
    /*
    const response = await axios.get<CoinMarketCapResponse>(
      `${BASE_URL}/v1/cryptocurrency/listings/latest`,
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
    */
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    return [];
  }
};

// Function to get data for a specific cryptocurrency
export const fetchCryptoDetails = async (id: number): Promise<CryptoData | null> => {
  try {
    // For development, return mock data
    const crypto = sampleCryptoData.find(crypto => crypto.id === id);
    return crypto || null;

    // In production, make an actual API call
    /*
    const response = await axios.get<any>(
      `${BASE_URL}/v1/cryptocurrency/quotes/latest`,
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
  } catch (error) {
    console.error(`Error fetching details for crypto ID ${id}:`, error);
    return null;
  }
};
