"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, EllipsisVertical, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import { deleteExpense } from "@/actions/expenses"
import type { ExpensesType } from "@/drizzle/schema"
import { formatCurrency, formatShortDate } from "@/lib/helpers"
import type { ExpenseListItem } from "@/lib/queries/expenses"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ExpenseDialog } from "../dialogs/ExpenseDialog"
import { CreateButton } from "../CreateButton"
import { EmptyState } from "../EmptyState"

type Expense = {
 description: string
 amount: string | number
 date: Date
}

type SortOrder = "asc" | "desc"

type ExpensesTableProps = {
 expenses: ExpenseListItem[]
}

const PAGE_SIZE = 15

export function ExpensesTable({ expenses }: ExpensesTableProps) {
 const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
 const [currentPage, setCurrentPage] = useState<number>(1)
 const [expenseDialogOpen, setExpenseDialogOpen] = useState<boolean>(false)
 const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined)
 const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)
 const [isPending, startTransition] = useTransition()
 const router = useRouter()
 
 const sortedExpenses = useMemo(() => {
  return [...expenses].sort((a, b) => {
   const aTime = new Date(a.date).getTime()
   const bTime = new Date(b.date).getTime()

   return sortOrder === "desc"
    ? bTime - aTime
    : aTime - bTime
  })
 }, [expenses, sortOrder])

 const totalPages = Math.ceil(
  sortedExpenses.length / PAGE_SIZE
 )

 const paginatedExpenses = useMemo(() => {
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE

  return sortedExpenses.slice(startIndex, endIndex)
 }, [sortedExpenses, currentPage])

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
  if (!expenseToDelete) {
   return
  }

  const id = expenseToDelete

  startTransition(async () => {
   await deleteExpense(id)
   router.refresh()
   toast.success("Expense deleted successfully!")
   setExpenseToDelete(null)
  })
 }

 const openCreateDialog = () => {
  setSelectedExpense(undefined)
  setExpenseDialogOpen(true)
 }

 const openEditDialog = (expense: Expense) => {
  setSelectedExpense(expense)
  setExpenseDialogOpen(true)
 }

 return (
  <>
   <Card className="h-full">
    <CardHeader>
     <CardTitle>Expenses</CardTitle>
    </CardHeader>
    <CardContent className="h-full">
     {expenses.length === 0 ? (
      <EmptyState
       message="No expenses found"
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
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="w-[80px] text-end">Actions</TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {paginatedExpenses.map((expense) => (
          <TableRow key={expense.id} className="h-12">
           <TableCell>{formatShortDate(expense.date)}</TableCell>
           <TableCell>{expense.description}</TableCell>
           <TableCell>{formatCurrency(Number(expense.amount))}</TableCell>
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
                 openEditDialog(expense)
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
                 setExpenseToDelete(expense.id)
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
   <ExpenseDialog
    open={expenseDialogOpen}
    onOpenChange={setExpenseDialogOpen}
    expense={selectedExpense as ExpensesType}
   />
   <AlertDialog
    open={expenseToDelete !== null}
    onOpenChange={(open) => {
     if (!open) {
      setExpenseToDelete(null)
     }
    }}
   >
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>Are you sure you want to delete this expense?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone and will permanently delete this expense.</AlertDialogDescription>
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