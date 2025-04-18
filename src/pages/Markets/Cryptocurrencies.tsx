import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { fetchTopCryptos, getHistoricalPriceData } from "@/services/cryptoApi";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from "lucide-react";

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

interface ChartData {
  date: string;
  price: number;
}

const Cryptocurrencies = () => {
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = useState<string>("7d");
  
  const { data: cryptoData, isLoading, error } = useQuery({
    queryKey: ["topCryptos"],
    queryFn: () => fetchTopCryptos(10),
    refetchInterval: 30000,
    staleTime: 10000,
  });

  useEffect(() => {
    if (cryptoData && cryptoData.length > 0 && !selectedCrypto) {
      setSelectedCrypto(cryptoData[0]);
    }
  }, [cryptoData, selectedCrypto]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!selectedCrypto) return;
      
      let days = 7;
      if (timeRange === "1d") days = 1;
      if (timeRange === "30d") days = 30;
      if (timeRange === "90d") days = 90;
      
      const data = await getHistoricalPriceData(selectedCrypto.symbol, days);
      setChartData(data);
    };
    
    fetchHistoricalData();
  }, [selectedCrypto, timeRange]);
  
  const handleSelectCrypto = (crypto: CryptoData) => {
    setSelectedCrypto(crypto);
    toast({
      title: `Loading ${crypto.name} data`,
      description: "Fetching latest market information",
    });
  };
  
  const getPercentChangeColor = (percentChange: number) => {
    if (percentChange > 0) return "text-green-500";
    if (percentChange < 0) return "text-red-500";
    return "text-gray-500";
  };
  
  const getPercentChangeIcon = (percentChange: number) => {
    if (percentChange > 0) return <ArrowUpIcon className="h-4 w-4" />;
    if (percentChange < 0) return <ArrowDownIcon className="h-4 w-4" />;
    return <ArrowRightIcon className="h-4 w-4" />;
  };
  
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Top Cryptocurrencies</h2>
            <Separator className="mb-4" />
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4">Failed to load cryptocurrency data</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {cryptoData?.map((crypto) => (
                  <div
                    key={crypto.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedCrypto?.id === crypto.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleSelectCrypto(crypto)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="font-bold">{crypto.symbol}</div>
                        <div className="text-sm opacity-80">{crypto.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-medium">${formatPrice(crypto.quote.USD.price)}</div>
                        <div className={`text-xs flex items-center justify-end ${getPercentChangeColor(crypto.quote.USD.percent_change_24h)}`}>
                          {getPercentChangeIcon(crypto.quote.USD.percent_change_24h)}
                          <span>{Math.abs(crypto.quote.USD.percent_change_24h).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        
        <div className="md:w-2/3">
          {selectedCrypto ? (
            <>
              <Card className="p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      {selectedCrypto.name}
                      <span className="ml-2 text-sm bg-muted px-2 py-1 rounded-full">
                        {selectedCrypto.symbol}
                      </span>
                    </h2>
                    <div className="text-3xl font-mono mt-2 mb-2">
                      ${formatPrice(selectedCrypto.quote.USD.price)}
                      <span 
                        className={`ml-2 text-sm ${getPercentChangeColor(selectedCrypto.quote.USD.percent_change_24h)}`}
                      >
                        {selectedCrypto.quote.USD.percent_change_24h > 0 ? "+" : ""}
                        {selectedCrypto.quote.USD.percent_change_24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button 
                      variant={timeRange === "1d" ? "default" : "outline"} 
                      onClick={() => setTimeRange("1d")}
                      size="sm"
                    >
                      1D
                    </Button>
                    <Button 
                      variant={timeRange === "7d" ? "default" : "outline"} 
                      onClick={() => setTimeRange("7d")}
                      size="sm"
                    >
                      7D
                    </Button>
                    <Button 
                      variant={timeRange === "30d" ? "default" : "outline"} 
                      onClick={() => setTimeRange("30d")}
                      size="sm"
                    >
                      30D
                    </Button>
                    <Button 
                      variant={timeRange === "90d" ? "default" : "outline"} 
                      onClick={() => setTimeRange("90d")}
                      size="sm"
                    >
                      90D
                    </Button>
                  </div>
                </div>
                
                <div className="h-[400px] mt-6">
                  <ChartContainer 
                    className="h-[400px]" 
                    config={{
                      price: {
                        label: "Price",
                        theme: {
                          light: "hsl(var(--primary))",
                          dark: "hsl(var(--primary))"
                        }
                      }
                    }}
                  >
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tickMargin={10}
                        tickFormatter={(value) => {
                          if (timeRange === "1d") {
                            return value.split("T")[1]?.substring(0, 5) || value;
                          }
                          return value.split("T")[0].substring(5);
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${formatPrice(value)}`}
                        domain={['auto', 'auto']}
                        tickMargin={10}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => {
                              const date = new Date(value);
                              return date.toLocaleString();
                            }}
                          />
                        }
                      />
                      <Line 
                        type="monotone" 
                        name="price"
                        dataKey="price" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-xl font-bold mb-4">Market Stats</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                    <div className="font-medium">
                      ${(selectedCrypto.quote.USD.market_cap / 1e9).toFixed(2)}B
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">24h Volume</div>
                    <div className="font-medium">
                      ${(selectedCrypto.quote.USD.volume_24h / 1e9).toFixed(2)}B
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">1h Change</div>
                    <div className={`font-medium flex items-center ${getPercentChangeColor(selectedCrypto.quote.USD.percent_change_1h)}`}>
                      {getPercentChangeIcon(selectedCrypto.quote.USD.percent_change_1h)}
                      <span>{Math.abs(selectedCrypto.quote.USD.percent_change_1h).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">24h Change</div>
                    <div className={`font-medium flex items-center ${getPercentChangeColor(selectedCrypto.quote.USD.percent_change_24h)}`}>
                      {getPercentChangeIcon(selectedCrypto.quote.USD.percent_change_24h)}
                      <span>{Math.abs(selectedCrypto.quote.USD.percent_change_24h).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">7d Change</div>
                    <div className={`font-medium flex items-center ${getPercentChangeColor(selectedCrypto.quote.USD.percent_change_7d)}`}>
                      {getPercentChangeIcon(selectedCrypto.quote.USD.percent_change_7d)}
                      <span>{Math.abs(selectedCrypto.quote.USD.percent_change_7d).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">API Key</div>
                    <div className="font-medium text-xs truncate">
                      21b1412d-3ca3-4a54-b4d9-e8a4f62d7969
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 flex items-center justify-center h-[400px]">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Select a cryptocurrency</h3>
                <p className="text-muted-foreground">
                  Choose a cryptocurrency from the list to view detailed information
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cryptocurrencies;
