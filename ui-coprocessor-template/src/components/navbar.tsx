'use client'
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useConnect, useAccount, useDisconnect, useChainId } from 'wagmi'

export default function Navbar() {
    const { connectors, isPending, connect } = useConnect()
    const { address, isConnected, chain } = useAccount()
    const { disconnect } = useDisconnect()

    return (
        <header className="bg-background text-foreground shadow-sm">
            <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold">Cartesi Polymarket</h1>
                </div>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                A Multi Outcome Prediction Market Fully On Chain!
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        {/* Add more menu items as needed */}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex space-x-2">
                    {isConnected ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger >
                                <Button variant="outline">
                                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Connected To: {chain?.name}</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => disconnect()}>Disconnect</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        connectors.map((connector) => (
                            <Button
                                key={connector.id}
                                onClick={() => connect({ connector })}
                                variant="outline"
                                disabled={isPending}
                            >
                                {isPending
                                    ? 'Connecting...'
                                    : `Connect with ${connector.name}`}
                            </Button>
                        ))
                    )}
                </div>
            </nav>
        </header>
    )
}