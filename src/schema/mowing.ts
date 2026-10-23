import { z } from "zod"

export const mowingSchema = z.object({
 customerId: z.uuid("Select a customer"),
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

export type MowingInput = z.infer<typeof mowingSchema>
export type MowingFormValues = z.input<typeof mowingSchema>