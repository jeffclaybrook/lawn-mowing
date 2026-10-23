import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { getExpenses } from "@/lib/queries/expenses"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { ExpensesTable } from "@/components/tables/ExpensesTable"

export const instant = false

export default async function Expenses() {
 const session = await getSession()

 if (!session) {
  redirect("/auth/sign-in")
 }

 const expenses = await getExpenses()

 return (
  <>
   <Header
    userName={session?.user.name}
    userImage={session?.user.image || undefined}
    breadcrumbPage="Expenses"
   />
   <div className="flex flex-1">
    <AppSidebar />
    <SidebarInset className="flex flex-col gap-4 flex-1 pb-4 md:px-4 pt-[--header-height:calc(--spacing(14))] overflow-y-auto">
     <div className="flex flex-col items-stretch pt-4 h-full">
      <ExpensesTable expenses={expenses} />
     </div>
    </SidebarInset>
   </div>
  </>
 )
}