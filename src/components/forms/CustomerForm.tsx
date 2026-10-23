"use client"

import { useEffect, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createCustomer, updateCustomer } from "@/actions/customers"
import type { CustomersType } from "@/drizzle/schema"
import { customerSchema, type CustomerInput } from "@/schema/customer"
import { Button } from "../ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

type CustomerFormProps = {
 customer?: CustomersType
 onClose?: () => void
}

export function CustomerForm({
 customer,
 onClose
}: CustomerFormProps) {
 const [isPending, startTransition] = useTransition()
 const isEditing = !!customer

 const form = useForm<CustomerInput>({
  resolver: zodResolver(customerSchema),
  defaultValues: {
   name: customer?.name ?? "",
   address: customer?.address ?? ""
  }
 })

 useEffect(() => {
  form.reset({
   name: customer?.name ?? "",
   address: customer?.address ?? ""
  })
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [customer, form.reset])

 const onSubmit = (values: CustomerInput) => {
  startTransition(async () => {
   try {
    if (isEditing) {
     await updateCustomer(customer.id, values)
     toast.success("Customer updated successfully!")
    } else {
     await createCustomer(values)
     toast.success("Customer created successfully!")
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
   <h1 className="text-xl">{isEditing ? "Update customer" : "Create customer"}</h1>
   <FieldGroup>
    <Controller
     control={form.control}
     name="name"
     render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} className="gap-1.5">
       <FieldLabel htmlFor={field.name}>Name</FieldLabel>
       <Input
        type="text"
        id={field.name}
        placeholder="Name"
        aria-invalid={fieldState.invalid}
        {...field}
       />
       {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
     )}
    />
    <Controller
     control={form.control}
     name="address"
     render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} className="gap-1.5">
       <FieldLabel htmlFor={field.name}>Address</FieldLabel>
       <Input
        type="text"
        id={field.name}
        placeholder="Address"
        aria-invalid={fieldState.invalid}
        {...field}
       />
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
       : "Create customer"
     }
    </Button>
   </div>
  </form>
 )
}