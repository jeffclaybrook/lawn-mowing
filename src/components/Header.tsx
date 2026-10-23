"use client"

import { useRouter } from "next/navigation"
import { LogOut, PanelLeft } from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { formatInitials } from "@/lib/helpers"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "./ui/breadcrumb"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"
import { useSidebar } from "./ui/sidebar"
import { ThemeToggle } from "./ThemeToggle"

type HeaderProps = {
 userName: string
 userImage?: string
 breadcrumbPage: string
}

export function Header({
 userName,
 userImage,
 breadcrumbPage
}: HeaderProps) {
 const { toggleSidebar } = useSidebar()
 const router = useRouter()

 return (
  <header className="flex items-center w-full border-b bg-card fixed top-0 z-50">
   <div className="flex items-center gap-2 px-4 w-full h-(--header-height)">
    <Button
     type="button"
     variant="ghost"
     size="icon"
     onClick={toggleSidebar}
    >
     <PanelLeft className="size-4" />
     <span className="sr-only">Toggle sidebar</span>
    </Button>
    <Separator orientation="vertical" className="mr-2 h-(--header-height)" />
    <Breadcrumb>
     <BreadcrumbList>
      <BreadcrumbItem>
       <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
      </BreadcrumbItem>
     </BreadcrumbList>
    </Breadcrumb>
    <div className="flex items-center gap-4 ml-auto">
     <ThemeToggle />
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
       <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
       >
        <Avatar>
         <AvatarImage src={userImage} alt={userName} />
         <AvatarFallback>{formatInitials(userName || "")}</AvatarFallback>
        </Avatar>
       </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
       <DropdownMenuGroup>
        <DropdownMenuItem
         variant="destructive"
         className="cursor-pointer"
         onClick={() => {
          signOut()
          router.push("/auth/sign-in")
         }}
        >
         <LogOut className="size-4" />
         Sign out
        </DropdownMenuItem>
       </DropdownMenuGroup>
      </DropdownMenuContent>
     </DropdownMenu>
    </div>
   </div>
  </header>
 )
}