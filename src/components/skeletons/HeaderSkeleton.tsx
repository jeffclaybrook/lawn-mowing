import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"

export function HeaderSkeleton() {
 return (
  <header className="flex items-center w-full border-b bg-card fixed top-0 z-50">
   <div className="flex items-center gap-2 px-4 w-full h-(--header-height)">
    <Skeleton className="size-8" />
    <Separator orientation="vertical" className="mr-2 h-(--header-height)" />
    <Skeleton className="h-4 w-8" />
    <div className="flex items-center gap-4 ml-auto">
     <Skeleton className="size-8" />
     <Skeleton className="size-8 rounded-full" />
    </div>
   </div>
  </header>
 )
}