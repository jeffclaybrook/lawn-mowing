"use client"

import type { CustomersType } from "@/drizzle/schema"
import { Dialog, DialogContent } from "../ui/dialog"
import { CustomerForm } from "../forms/CustomerForm"

export function CustomerDialog({
 open,
 onOpenChange,
 customer
}: {
 open: boolean
 onOpenChange: (open: boolean) => void
 customer?: CustomersType
}) {
 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent>
    <CustomerForm
     customer={customer}
     onClose={() => onOpenChange(false)}
    />
   </DialogContent>
  </Dialog>
 )
}