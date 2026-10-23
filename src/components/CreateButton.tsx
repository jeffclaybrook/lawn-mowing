"use client"

import { useMediaQuery } from "usehooks-ts"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"


export function CreateButton({
 onClick
}: {
 onClick: () => void
}) {
 const isMobile = useMediaQuery("(max-width: 1024px)", {
  initializeWithValue: false
 })

 return (
  <Button
   type="button"
   variant="custom"
   size={isMobile ? "sm" : "lg"}
   onClick={onClick}
   className="fixed bottom-6 right-6 z-50 shadow-lg rounded-lg !h-11"
  >
   <Plus className="size-5" />
   {!isMobile && <span className="inline-block">Create</span>}
   <span className="sr-only">Create</span>
  </Button>
 )
}