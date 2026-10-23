"use client"

import type { CustomersType, MowingsType } from "@/drizzle/schema"
import { Dialog, DialogContent } from "../ui/dialog"
import { MowingForm } from "../forms/MowingForm"

export function MowingDialog({
 open,
 onOpenChange,
 mowing,
 customers
}: {
 open: boolean
 onOpenChange: (open: boolean) => void
 mowing: MowingsType
 customers: CustomersType[]
}) {
 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent>
    <MowingForm
     mowing={mowing}
     customers={customers}
     onClose={() => onOpenChange(false)}
    />
   </DialogContent>
  </Dialog>
 )
}