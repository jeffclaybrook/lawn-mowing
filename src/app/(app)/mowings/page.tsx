import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { getMowings } from "@/lib/queries/mowings"
import { getCustomers } from "@/lib/queries/customers"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { MowingsTable } from "@/components/tables/MowingsTable"

export const instant = false

export default async function Mowings() {
 const session = await getSession()

 if (!session) {
  redirect("/auth/sign-in")
 }

 const mowings = await getMowings()
 const customers = await getCustomers()

 return (
  <>
   <Header
    userName={session?.user.name}
    userImage={session?.user.image || undefined}
    breadcrumbPage="Mowings"
   />
   <div className="flex flex-1">
    <AppSidebar />
    <SidebarInset className="flex flex-col gap-4 flex-1 pb-4 md:px-4 pt-[--header-height:calc(--spacing(14))] overflow-y-auto">
     <div className="flex flex-col items-stretch pt-4 h-full">
      <MowingsTable
       mowings={mowings}
       customers={customers}
      />
     </div>
    </SidebarInset>
   </div>
  </>
 )
}