'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OutcomeDrawer } from '@/components/outcome-drawer'
import { MultiOutcomePredictionMarketAddress, MultiOutcomePredictionMarket } from '@/contracts-abi/MultiOutcomePredictionMarketABI'
import { useReadContract } from 'wagmi'

interface MarketData {
    question: string;
    circulatingShares: BigInt[];
    outcomes: string[];
    liquidity: BigInt;
    isResolved: boolean;
    probabilities: BigInt[];
}

// Changed from "App" to "Page"
export default function Page() {
  const { data: marketDataArray, error, isLoading } = useReadContract<BigInt[]>({
    address: MultiOutcomePredictionMarketAddress,
    abi: MultiOutcomePredictionMarket,
    functionName: 'getMarket',
    args: [2],
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    console.error('Error fetching market data:', error);
    return <p>Error: {error.message}</p>;
  }

  console.log('Market Data:', marketDataArray);

  const marketData = {
    question: marketDataArray[0] as string,
    circulatingShares: marketDataArray[1] as BigInt[],
    outcomes: marketDataArray[2] as string[],
    liquidity: marketDataArray[3] as BigInt,
    isResolved: marketDataArray[4] as boolean,
    probabilities: marketDataArray[5] as BigInt[],
  };

  const circulatingSharesNumbers = marketData.circulatingShares.map(share => Number(share));
  const probabilitiesNumbers = marketData.probabilities.map(prob => Number(prob));

  return (
    <div className="h-screen w-screen flex items-start justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-[500px] max-w-full mt-50">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">{marketData.question || "Market Data Unavailable"}</CardTitle>
          <CardDescription className="text-center">Place your prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p>Outcomes:</p>
            <div>
              {marketData.outcomes && marketData.outcomes.length > 0 ? (
                marketData.outcomes.map((outcome: string, index: number) => (
                  <div key={index}>
                    {outcome} - Shares: {marketData.circulatingShares[index]?.toString() || "N/A"}
                  </div>
                ))
              ) : (
                <div>No outcomes available</div>
              )}
            </div>
            <p>Liquidity: {marketData.liquidity ? marketData.liquidity.toString() : "N/A"}</p>
            <p>Is Resolved: {marketData.isResolved ? 'Yes' : 'No'}</p>
          </div>
          <OutcomeDrawer outcomes={marketData.outcomes} probabilities={probabilitiesNumbers} />
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 - Powered By Cartesi & Eigenlayer</p>
        </CardFooter>
      </Card>
    </div>
  )
}