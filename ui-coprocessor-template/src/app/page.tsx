'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OutcomeDrawer } from '@/components/outcome-drawer' // Import the DrawerDemo component
import { MultiOutcomePredictionMarketAddress, MultiOutcomePredictionMarket } from '@/contracts-abi/MultiOutcomePredictionMarketABI'
import { useReadContract } from 'wagmi'

function App() {
  const { data: marketCount } = useReadContract({
    address: MultiOutcomePredictionMarketAddress,
    abi: MultiOutcomePredictionMarket,
    functionName: 'getMarketCount', // Replace with your actual function name
    args: [],
  });

  const { data: marketData, error, isLoading } = useReadContract({
    address: MultiOutcomePredictionMarketAddress,
    abi: MultiOutcomePredictionMarket,
    functionName: 'getMarket',
    args: [1], // Use the correct market ID
  });

  if (isLoading) return <p>Loading...</p>;
  
  // Log the error object for more context
  if (error) {
    console.error('Error fetching market data:', error);
    return <p>Error: {error.message}</p>;
  }

  // Log the market data
  console.log('Market Data:', marketData);
  console.log('Market Count:', marketCount); // Log the market count

  return (
    <div className="h-screen w-screen flex items-start justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-[500px] max-w-full mt-50">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Who's going to win Formula 1 Championship in 2025?</CardTitle>
          <CardDescription className="text-center">Place your prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display market data */}
          {marketData && (
            <div>
              <p>Question: {marketData.question}</p>
              <p>Liquidity: {marketData.liquidity.toString()}</p>
              <p>Is Resolved: {marketData.isResolved ? 'Yes' : 'No'}</p>
              <OutcomeDrawer 
                outcomes={marketData.outcomes} 
                probabilities={marketData.probabilities} // Pass the outcomes and probabilities
              />
            </div>
          )}
          {/* Connected Accounts */}
          <div className="text-center">
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 - Powered By Cartesi & Eigenlayer</p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App