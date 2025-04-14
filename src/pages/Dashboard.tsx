
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { fetchTopCryptos, getHistoricalPriceData } from "@/services/cryptoApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, TrendingUp, LineChart, PieChart, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTopCryptos(10);
        setCryptos(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Crypto Dashboard</h1>
            <p className="text-muted-foreground">
              Track, analyze, and optimize your crypto portfolio with AI-powered insights
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Tabs defaultValue="market" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="market" className="flex items-center gap-1">
                  <BarChart3 size={16} />
                  <span className="hidden sm:inline">Market</span>
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center gap-1">
                  <PieChart size={16} />
                  <span className="hidden sm:inline">Portfolio</span>
                </TabsTrigger>
                <TabsTrigger value="watchlist" className="flex items-center gap-1">
                  <LineChart size={16} />
                  <span className="hidden sm:inline">Watchlist</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Market Overview Card */}
        <Card className="mb-8 border border-border hover-scale animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-crypto-purple" size={20} />
              Market Overview
            </CardTitle>
            <CardDescription>
              Global cryptocurrency market data and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Global Market Cap</p>
                <p className="text-2xl font-bold">$2.14T</p>
                <div className="flex items-center text-crypto-green mt-1">
                  <ArrowUpRight size={16} />
                  <span className="text-sm">2.4%</span>
                </div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold">$98.7B</p>
                <div className="flex items-center text-crypto-red mt-1">
                  <ArrowDownRight size={16} />
                  <span className="text-sm">1.2%</span>
                </div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">BTC Dominance</p>
                <p className="text-2xl font-bold">43.8%</p>
                <div className="flex items-center text-crypto-green mt-1">
                  <ArrowUpRight size={16} />
                  <span className="text-sm">0.5%</span>
                </div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Active Cryptocurrencies</p>
                <p className="text-2xl font-bold">22,345</p>
                <div className="flex items-center text-crypto-green mt-1">
                  <ArrowUpRight size={16} />
                  <span className="text-sm">15</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Cryptocurrencies */}
        <h2 className="text-xl font-bold mb-4">Top Cryptocurrencies</h2>
        <div className="overflow-x-auto animate-slide-in mb-8">
          <table className="w-full crypto-card">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">24h %</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">7d %</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Market Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-4"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-32"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-24 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-28 ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                cryptos.map((crypto, index) => (
                  <tr key={crypto.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-crypto-purple/20 flex items-center justify-center text-xs font-bold mr-3">
                          {crypto.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-medium">
                      ${crypto.quote.USD.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-4 text-right ${crypto.quote.USD.percent_change_24h > 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {crypto.quote.USD.percent_change_24h > 0 ? '+' : ''}{crypto.quote.USD.percent_change_24h.toFixed(2)}%
                    </td>
                    <td className={`px-4 py-4 text-right ${crypto.quote.USD.percent_change_7d > 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {crypto.quote.USD.percent_change_7d > 0 ? '+' : ''}{crypto.quote.USD.percent_change_7d.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 text-right">
                      ${(crypto.quote.USD.market_cap / 1e9).toFixed(2)}B
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover-scale animate-fade-in">
            <CardHeader>
              <CardTitle>AI Market Analysis</CardTitle>
              <CardDescription>Powered by advanced AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Market sentiment is currently <span className="font-medium text-crypto-green">bullish</span> with Bitcoin maintaining support above $60,000. Ethereum continues its upward trend with increasing network activity.
              </p>
              <a href="/ai-analysis" className="mt-4 block text-sm text-primary hover:underline">
                View detailed analysis →
              </a>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Connect your wallet to track</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-col h-[150px] text-center">
              <p className="text-muted-foreground mb-4">
                Connect your crypto wallet to track performance and get AI-powered insights.
              </p>
              <a href="/login" className="text-sm text-primary hover:underline">
                Sign in to connect wallet →
              </a>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in">
            <CardHeader>
              <CardTitle>Latest News</CardTitle>
              <CardDescription>Stay updated with crypto trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <p className="text-sm font-medium">Bitcoin ETF Shows Strong Inflows</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </li>
                <li>
                  <p className="text-sm font-medium">Ethereum Scaling Solution Launches</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </li>
                <li>
                  <p className="text-sm font-medium">New Regulatory Framework Proposed</p>
                  <p className="text-xs text-muted-foreground">12 hours ago</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
