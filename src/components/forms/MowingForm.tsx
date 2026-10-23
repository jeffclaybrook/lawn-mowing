"use client"

import { useEffect, useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createMowing, updateMowing } from "@/actions/mowings"
import type { CustomersType, MowingsType } from "@/drizzle/schema"
import { formatDateInput } from "@/lib/helpers"
import { mowingSchema, type MowingInput, type MowingFormValues } from "@/schema/mowing"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type MowingFormProps = {
 mowing?: MowingsType
 customers: Pick<CustomersType, "id" | "name">[]
 onClose?: () => void
}

export function MowingForm({
 mowing,
 customers,
 onClose
}: MowingFormProps) {
 const [open, setOpen] = useState<boolean>(false)
 const [isPending, startTransition] = useTransition()
 const isEditing = !!mowing

 const form = useForm<MowingFormValues, unknown, MowingInput>({
  resolver: zodResolver(mowingSchema),
  defaultValues: {
   customerId: mowing?.customerId ?? "",
   amount: mowing?.amount ?? "",
   date: mowing?.date ? new Date(mowing.date) : new Date()
  }
 })

 useEffect(() => {
  form.reset({
   customerId: mowing?.customerId ?? "",
   amount: mowing?.amount ?? "",
   date: mowing?.date ? new Date(mowing.date) : new Date()
  })
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [mowing, form.reset])

 const onSubmit = (values: MowingInput) => {
  startTransition(async () => {
   try {
    if (isEditing) {
     await updateMowing(mowing.id, values)
     toast.success("Mowing updated successfully!")
    } else {
     await createMowing(values)
     toast.success("Mowing created successfully!")
    }

    form.reset()
    onClose?.()
   } catch (error) {
    form.setError("root", {
     message:
      error instanceof Error
       ? error.message
       : "Something went wrong. Please try again."
    })

    toast.error("Something went wrong. Please try again.")
   }
  })
 }

 return (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
   <h1 className="text-xl">{isEditing ? "Update mowing" : "Create mowing"}</h1>
   <FieldGroup>
    <Controller
     control={form.control}
     name="customerId"
     render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} className="gap-1.5">
       <FieldLabel htmlFor={field.name}>Customer</FieldLabel>
       <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
       >
        <SelectTrigger className="!h-11">
         <SelectValue placeholder="Select a customer..." />
        </SelectTrigger>
        <SelectContent position="popper">
         {customers.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">No customers yet.</div>
         ) : (
          customers.map((customer) => (
           <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
          ))
         )}
        </SelectContent>
       </Select>
       {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
     )}
    />
    <Controller
     control={form.control}
     name="amount"
     render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} className="gap-1.5">
       <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
       <InputGroup>
        <InputGroupAddon>
         <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
         type="text"
         id={field.name}
         name={field.name}
         ref={field.ref}
         onBlur={field.onBlur}
         value={field.value == null ? "" : String(field.value)}
         onChange={(e) => field.onChange(e.target.value)}
         aria-invalid={fieldState.invalid}
         inputMode="decimal"
         placeholder="0.00"
        />
       </InputGroup>
       {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
     )}
    />
    <Controller
     control={form.control}
     name="date"
     render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} className="gap-1.5">
       <FieldLabel htmlFor={field.name}>Date mowed</FieldLabel>
       <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
         <Button
          type="button"
          variant="outline"
          id={field.name}
          className="justify-start text-start w-full font-normal h-11"
         >
          <CalendarIcon className="size-4" />
          {field.value ? formatDateInput(field.value as Date) : "Select a date..."}
         </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
         <Calendar
          mode="single"
          selected={field.value as Date | undefined}
          onSelect={(date) => {
           field.onChange(date)
           setOpen(false)
          }}
          disabled={(date) => date > new Date()}
         />
        </PopoverContent>
       </Popover>
       {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
     )}
    />
   </FieldGroup>
   {form.formState.errors.root && (
    <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
   )}
   <div className="flex justify-end gap-2">
    <Button
     type="button"
     variant="outline"
     onClick={onClose}
     disabled={isPending}
     className="h-11"
    >
     Cancel
    </Button>
    <Button
     type="submit"
     variant="custom"
     disabled={isPending}
     className="h-11"
    >
     {isPending
      ? (
       <>
        <Loader2 className="size-4 animate-spin" />
        Saving...
       </>
      ) : isEditing
       ? "Save changes"
       : "Create mowing"
     }
    </Button>
   </div>
  </form>
 )
}