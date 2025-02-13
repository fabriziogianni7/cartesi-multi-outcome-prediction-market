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

import { Calendar, Home, LucideMessageCircleQuestion, Search, Settings } from "lucide-react"


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
    // {
    //     title: "Calendar",
    //     url: "#",
    //     icon: Calendar,
    // },
    // {
    //     title: "Search",
    //     url: "#",
    //     icon: Search,
    // },
    // {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings,
    // },
]

export function AppSidebar() {
    return (
        <Sidebar >
            <SidebarHeader>
                <SidebarGroupLabel>PolyMarktesi</SidebarGroupLabel>
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
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {/* <SidebarGroupLabel> */}
                <p>
                    Built by <a href="https://github.com/fabriziogianni7" >@Fabriziogianni7</a> and <a href="https://github.com/SolidityDrone" >@SolidityDrone</a>
                </p>
                {/* </SidebarGroupLabel> */}
            </SidebarFooter>
        </Sidebar>
    )
}
