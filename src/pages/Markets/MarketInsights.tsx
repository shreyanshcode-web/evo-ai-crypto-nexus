
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, Clock, ExternalLink, Search, RefreshCcw } from "lucide-react";
import { fetchCryptoNews } from "@/services/newsApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const MarketInsights = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<string | number>(1);
  
  const { data: news, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["crypto-news", page],
    queryFn: () => fetchCryptoNews(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing news",
      description: "Getting the latest cryptocurrency updates"
    });
  };

  const filteredNews = news?.filter((article) => 
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Insights</h1>
          <p className="text-muted-foreground">
            Latest news and updates from the cryptocurrency world
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="mt-4 md:mt-0"
          disabled={isFetching}
        >
          <RefreshCcw size={16} className={`mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search for news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader>
            <CardTitle>Error Loading News</CardTitle>
            <CardDescription>
              We couldn't load the latest news. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredNews && filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="md:flex">
                {article.image_url && (
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Replace broken image with a placeholder
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                <div className={`${article.image_url ? "md:w-3/4" : "w-full"}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                          <a href={article.link} target="_blank" rel="noopener noreferrer">
                            {article.title}
                          </a>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Newspaper size={14} />
                          <span>{article.source_id}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {article.description}
                    </p>
                    <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{formatDate(article.pubDate)}</span>
                      </div>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-primary transition-colors"
                      >
                        Read more
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              Try adjusting your search term or check back later for new articles.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!isLoading && filteredNews && filteredNews.length > 0 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (typeof page === 'number' && page > 1) {
                      setPage(page - 1);
                    }
                  }}
                  className={`${typeof page === 'number' && page > 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>
                  {typeof page === 'string' ? 'Next Page' : page}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (typeof page === 'string') {
                      // If page is a string (nextPage token), we need to fetch next page
                      setPage(1);
                    } else {
                      setPage(page + 1);
                    }
                  }}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MarketInsights;
