import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { HeaderSkeleton } from "@/components/skeletons/HeaderSkeleton"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"

export default function HomeLoading() {
 return (
  <>
   <HeaderSkeleton />
   <div className="flex flex-1">
    <AppSidebar />
    <SidebarInset className="flex flex-col gap-4 flex-1 pb-4 md:px-4 pt-[--header-height:calc(--spacing(14))] overflow-y-auto">
     <div className="flex flex-col items-stretch pt-4 h-full">
      <TableSkeleton />
     </div>
    </SidebarInset>
   </div>
  </>
 )
}