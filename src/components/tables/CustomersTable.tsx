"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, EllipsisVertical, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import { deleteCustomer } from "@/actions/customers"
import type { CustomersType } from "@/drizzle/schema"
import { formatDate } from "@/lib/helpers"
import type { CustomerListItem } from "@/lib/queries/customers"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { CustomerDialog } from "../dialogs/CustomerDialog"
import { CreateButton } from "../CreateButton"
import { EmptyState } from "../EmptyState"

type Customer = {
 name: string
 address: string
}

type SortOrder = "asc" | "desc"

type CustomersTableProps = {
 customers: CustomerListItem[]
}

const PAGE_SIZE = 15

export function CustomersTable({ customers }: CustomersTableProps) {
 const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
 const [currentPage, setCurrentPage] = useState<number>(1)
 const [customerDialogOpen, setCustomerDialogOpen] = useState<boolean>(false)
 const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>()
 const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)
 const [isPending, startTransition] = useTransition()
 const router = useRouter()

 const sortedCustomers = useMemo(() => {
  return [...customers].sort((a, b) => {
   const comparison = a.name.localeCompare(
    b.name,
    undefined,
    {
     sensitivity: "base"
    }
   )

   return sortOrder === "asc"
    ? comparison
    : -comparison
  })
 }, [customers, sortOrder])

 const totalPages = Math.ceil(
  sortedCustomers.length / PAGE_SIZE
 )

 const paginatedCustomers = useMemo(() => {
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE

  return sortedCustomers.slice(startIndex, endIndex)
 }, [sortedCustomers, currentPage])

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
  if (!customerToDelete) {
   return
  }

  const id = customerToDelete

  startTransition(async () => {
   await deleteCustomer(id)
   router.refresh()
   toast.success("Customer deleted successfully!")
   setCustomerToDelete(null)
  })
 }

 const openCreateDialog = () => {
  setSelectedCustomer(undefined)
  setCustomerDialogOpen(true)
 }

 const openEditDialog = (customer: Customer) => {
  setSelectedCustomer(customer)
  setCustomerDialogOpen(true)
 }

 return (
  <>
   <Card className="h-full">
    <CardHeader>
     <CardTitle>Customers</CardTitle>
    </CardHeader>
    <CardContent className="h-full">
     {customers.length === 0 ? (
      <EmptyState
       message="No customers found"
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
            Name
            {sortOrder === "desc"
             ? <ArrowDown className="size-3" />
             : <ArrowUp className="size-3" />
            }
           </div>
          </TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Last mowed</TableHead>
          <TableHead className="w-[80px] text-end">Actions</TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {paginatedCustomers.map((customer) => (
          <TableRow key={customer.id} className="h-12">
           <TableCell>{customer.name}</TableCell>
           <TableCell>{customer.address}</TableCell>
           <TableCell>{customer.lastMowedAt ? formatDate(customer.lastMowedAt as Date) : "Not mowed yet"}</TableCell>
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
                 openEditDialog(customer)
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
                 setCustomerToDelete(customer.id)
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
   <CustomerDialog
    open={customerDialogOpen}
    onOpenChange={setCustomerDialogOpen}
    customer={selectedCustomer as CustomersType}
   />
   <AlertDialog
    open={customerToDelete !== null}
    onOpenChange={(open) => {
     if (!open) {
      setCustomerToDelete(null)
     }
    }}
   >
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>Are you sure you want to delete this customer?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone and will permanently delete this customer.</AlertDialogDescription>
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