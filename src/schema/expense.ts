import { z } from "zod"

export const expenseSchema = z.object({
 description: z.string().min(1, "Description is required").max(255),
 amount: z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .pipe(
   z
    .string()
    .min(1, "Amount is required")
    .regex(
     /^\d+(\.\d{1,2})?$/,
     "Amount must be greater than 0"
    )
    .transform(Number)
  ),
  date: z.coerce.date()
})

export type ExpenseInput = z.infer<typeof expenseSchema>
export type ExpenseFormValues = z.input<typeof expenseSchema>