import { redirect } from "next/navigation"
import { getOptionalSession } from "@/lib/get-session"
import { SignUpForm } from "@/components/forms/SignUpForm"

export const instant = false

export default async function SignUp() {
 const session = await getOptionalSession()

 if (session) {
  redirect("/")
 }

 return (
  <SignUpForm />
 )
}