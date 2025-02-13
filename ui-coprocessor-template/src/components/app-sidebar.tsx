import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Calendar, Home, LucideMessageCircleQuestion, Search, DollarSignIcon, DollarSign } from "lucide-react"


// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "How It Works",
        url: "#",
        icon: LucideMessageCircleQuestion,
    },
]

export function AppSidebar() {
    return (
        <Sidebar >
            <SidebarHeader>
                <SidebarGroupLabel>Cartesi Polymarket</SidebarGroupLabel>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <span>
                                        <DollarSignIcon></DollarSignIcon>
                                        <a href="https://cloud.google.com/application/web3/faucet/ethereum/holesky" target="_blank" className="text-blue-500 hover:underline">Holesky Faucet</a>
                                    </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
            </SidebarContent >
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <p>
                            Built by <a href="https://github.com/fabriziogianni7" >@Fabriziogianni7</a> and <a href="https://github.com/SolidityDrone" >@SolidityDrone</a>
                        </p>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* <SidebarGroupLabel> */}
                {/* </SidebarGroupLabel> */}
            </SidebarFooter>
        </Sidebar >
    )
}
