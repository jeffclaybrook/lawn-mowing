"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, EllipsisVertical, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import { deleteMowing } from "@/actions/mowings"
import type { CustomersType, MowingsType } from "@/drizzle/schema"
import { formatCurrency, formatShortDate } from "@/lib/helpers"
import type { MowingListItem } from "@/lib/queries/mowings"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { MowingDialog } from "../dialogs/MowingDialog"
import { CreateButton } from "../CreateButton"
import { EmptyState } from "../EmptyState"

type Mowing = {
 customerId: string
 amount: string | number
 date: Date
}

type Customer = {
 id: string
 name: string
}

type SortOrder = "asc" | "desc"

type MowingsTableProps = {
 mowings: MowingListItem[]
 customers: Customer[]
}

const PAGE_SIZE = 15

export function MowingsTable({
 mowings,
 customers
}: MowingsTableProps) {
 const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
 const [currentPage, setCurrentPage] = useState<number>(1)
 const [mowingDialogOpen, setMowingDialogOpen] = useState<boolean>(false)
 const [selectedMowing, setSelectedMowing] = useState<Mowing | undefined>(undefined)
 const [mowingToDelete, setMowingToDelete] = useState<string | null>(null)
 const [isPending, startTransition] = useTransition()
 const router = useRouter()

 const sortedMowings = useMemo(() => {
  return [...mowings].sort((a, b) => {
   const aTime = new Date(a.date).getTime()
   const bTime = new Date(b.date).getTime()

   return sortOrder === "asc"
    ? bTime - aTime
    : aTime - bTime
  })
 }, [mowings, sortOrder])

 const totalPages = Math.ceil(
  sortedMowings.length / PAGE_SIZE
 )

 const paginatedMowings = useMemo(() => {
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE

  return sortedMowings.slice(startIndex, endIndex)
 }, [sortedMowings, currentPage])

 const toggleSortOrder = () => {
  setSortOrder((current) =>
   current === "asc" ? "desc" : "asc"
  )

  setCurrentPage(1)
 }

 useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
   // eslint-disable-next-line react-hooks/set-state-in-effect
   setCurrentPage(totalPages)
  }
 }, [currentPage, totalPages])

 const handleDelete = () => {
  if (!mowingToDelete) {
   return
  }

  const id = mowingToDelete

  startTransition(async () => {
   await deleteMowing(id)
   router.refresh()
   toast.success("Mowing deleted successfully!")
   setMowingToDelete(null)
  })
 }

 const openCreateDialog = () => {
  setSelectedMowing(undefined)
  setMowingDialogOpen(true)
 }

 const openEditDialog = (mowing: Mowing) => {
  setSelectedMowing(mowing)
  setMowingDialogOpen(true)
 }

 return (
  <>
   <Card className="h-full">
    <CardHeader>
     <CardTitle>Mowings</CardTitle>
    </CardHeader>
    <CardContent className="h-full">
     {mowings.length === 0 ? (
      <EmptyState
       message="No mowings found"
       onClick={openCreateDialog}
      />
     ) : (
      <>
       <Table>
        <TableHeader>
         <TableRow>
          <TableHead>
           <div
            role="button"
            onClick={toggleSortOrder}
            className="inline-flex items-center gap-1 cursor-pointer"
           >
            Date
            {sortOrder === "desc"
             ? <ArrowDown className="size-3" />
             : <ArrowUp className="size-3" />
            }
           </div>
          </TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="w-[80px] text-end">Actions</TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {paginatedMowings.map((mowing) => (
          <TableRow key={mowing.id} className="h-12">
           <TableCell>{formatShortDate(mowing.date)}</TableCell>
           <TableCell>{mowing.customerName}</TableCell>
           <TableCell>{formatCurrency(Number(mowing.amount))}</TableCell>
           <TableCell className="text-end">
            <DropdownMenu>
             <DropdownMenuTrigger asChild>
              <Button
               type="button"
               variant="ghost"
               size="icon"
              >
               <EllipsisVertical className="size-4" />
               <span className="sr-only">More</span>
              </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end">
              <DropdownMenuGroup>
               <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => {
                 e.preventDefault()
                 openEditDialog(mowing)
                }}
               >
                <Pencil className="size-4" />
                Edit
               </DropdownMenuItem>
               <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onSelect={(e) => {
                 e.preventDefault()
                 setMowingToDelete(mowing.id)
                }}
               >
                <Trash className="size-4" />
                Delete
               </DropdownMenuItem>
              </DropdownMenuGroup>
             </DropdownMenuContent>
            </DropdownMenu>
           </TableCell>
          </TableRow>
         ))}
        </TableBody>
       </Table>
       <CreateButton onClick={openCreateDialog} />
      </>
     )}
    </CardContent>
   </Card>
   {totalPages > 1 && (
    <div className="flex items-center justify-start gap-2 mt-4">
     <Button
      type="button"
      variant="outline"
      onClick={() => setCurrentPage((page) => page - 1)}
      disabled={currentPage === 1}
     >
      <ChevronLeft className="size-4" />
      Prev
     </Button>
     <Button
      type="button"
      variant="outline"
      onClick={() => setCurrentPage((page) => page + 1)}
      disabled={currentPage === totalPages}
     >
      Next
      <ChevronRight className="size-4" />
     </Button>
    </div>
   )}
   <MowingDialog
    open={mowingDialogOpen}
    onOpenChange={setMowingDialogOpen}
    mowing={selectedMowing as MowingsType}
    customers={customers as CustomersType[]}
   />
   <AlertDialog
    open={mowingToDelete !== null}
    onOpenChange={(open) => {
     if (!open) {
      setMowingToDelete(null)
     }
    }}
   >
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>Are you sure you want to delete this mowing?</AlertDialogTitle>
      <AlertDialogDescription>Thi action cannot be undone and will permanently delete his mowing.</AlertDialogDescription>
     </AlertDialogHeader>
     <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
       variant="destructive"
       onClick={handleDelete}
       disabled={isPending}
      >
       <Trash className="size-4" />
       Delete
      </AlertDialogAction>
     </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>
  </>
 )
}