"use client"

import { useEffect, useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createExpense, updateExpense } from "@/actions/expenses"
import type { ExpensesType } from "@/drizzle/schema"
import { formatDateInput } from "@/lib/helpers"
import { expenseSchema, type ExpenseInput, type ExpenseFormValues } from "@/schema/expense"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type ExpenseFormProps = {
 expense?: ExpensesType
 onClose?: () => void
}

export function ExpenseForm({
 expense,
 onClose
}: ExpenseFormProps) {
 const [open, setOpen] = useState<boolean>(false)
 const [isPending, startTransition] = useTransition()
 const isEditing = !!expense

 const form = useForm<ExpenseFormValues, unknown, ExpenseInput>({
  resolver: zodResolver(expenseSchema),
  defaultValues: {
   description: expense?.description ?? "",
   amount: expense?.amount ?? "",
   date: expense?.date ? new Date(expense.date) : new Date()
  }
 })

 useEffect(() => {
  form.reset({
   description: expense?.description ?? "",
   amount: expense?.amount ?? "",
   date: expense?.date ? new Date(expense.date) : new Date()
  })
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [expense, form.reset])

 const onSubmit = (values: ExpenseInput) => {
  startTransition(async () => {
   try {
    if (isEditing) {
     await updateExpense(expense.id, values)
     toast.success("Expense updated successfully!")
    } else {
     await createExpense(values)
     toast.success("Expense created successfully!")
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
   <h1 className="text-xl">{isEditing ? "Update expense" : "Create expense"}</h1>
   <FieldGroup>
    <Controller
     control={form.control}
     name="description"
     render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} className="gap-1.5">
       <FieldLabel htmlFor={field.name}>Description</FieldLabel>
       <Input
        type="text"
        id={field.name}
        placeholder="Description"
        aria-invalid={fieldState.invalid}
        {...field}
       />
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
       <FieldLabel htmlFor={field.name}>Date purchased</FieldLabel>
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
       : "Create expense"
     }
    </Button>
   </div>
  </form>
 )
}