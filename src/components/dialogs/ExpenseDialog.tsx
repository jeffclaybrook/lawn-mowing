"use client"

import type { ExpensesType } from "@/drizzle/schema"
import { Dialog, DialogContent } from "../ui/dialog"
import { ExpenseForm } from "../forms/ExpenseForm"

export function ExpenseDialog({
 open,
 onOpenChange,
 expense
}: {
 open: boolean
 onOpenChange: (open: boolean) => void
 expense: ExpensesType
}) {
 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent>
    <ExpenseForm
     expense={expense}
     onClose={() => onOpenChange(false)}
    />
   </DialogContent>
  </Dialog>
 )
}