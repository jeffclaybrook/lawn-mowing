import { redirect } from "next/navigation"
import { getOptionalSession } from "@/lib/get-session"
import { SignInForm } from "@/components/forms/SignInForm"

export const instant = false

export default async function SignIn() {
 const session = await getOptionalSession()

 if (session) {
  redirect("/")
 }

 return (
  <SignInForm />
 )
}