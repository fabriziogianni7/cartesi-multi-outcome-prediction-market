'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OutcomeDrawer } from '@/components/outcome-drawer' // Import the DrawerDemo component

function App() {
  return (
    <div className="h-screen w-screen flex items-start justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-[500px] max-w-full mt-50">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Who's going to win Formula 1 Championship in 2025?</CardTitle>
          <CardDescription className="text-center">place your prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connected Accounts */}
          <div className="text-center">
          </div>
          {/* drawer */}
          <div className="flex justify-center"> {/* Center the DrawerTrigger */}
            <OutcomeDrawer /> {/* Render the DrawerDemo here */}
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