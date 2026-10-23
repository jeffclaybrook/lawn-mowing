"use client"

import { ComponentProps } from "react"
import { usePathname } from "next/navigation"
import { CalendarDays, ChartColumn, House, Receipt, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"
import Link from "next/link"

const links = [
 { label: "Home", href: "/", icon: House },
 { label: "Mowings", href: "/mowings", icon: CalendarDays },
 { label: "Customers", href: "/customers", icon: Users },
 { label: "Expenses", href: "/expenses", icon: Receipt },
 { label: "Analytics", href: "/analytics", icon: ChartColumn }
]

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
 const { isMobile, setOpenMobile } = useSidebar()
 const pathname = usePathname()

 return (
  <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
   <SidebarContent>
    <SidebarGroup>
     <SidebarMenu>
      {links.map((link) => (
       <SidebarMenuItem key={link.label}>
        <SidebarMenuButton
         size="md"
         className={cn(
          "hover:bg-custom-primary/40",
          pathname === link.href && "bg-custom-primary/60"
         )}
         asChild
        >
         <Link
          href={link.href}
          onClick={() => {
           if (isMobile) {
            setOpenMobile(false)
           }
          }}
         >
          <link.icon className="size-4" />
          {link.label}
         </Link>
        </SidebarMenuButton>
       </SidebarMenuItem>
      ))}
     </SidebarMenu>
    </SidebarGroup>
   </SidebarContent>
  </Sidebar>
 )
}