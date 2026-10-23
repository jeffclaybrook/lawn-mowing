"use client"

import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { EmptyStateIcon } from "./Icons"

type EmptyStateProps = {
 message: string
 onClick?: () => void
}

export function EmptyState({
 message,
 onClick
}: EmptyStateProps) {
 return (
  <div className="flex flex-col items-center justify-center text-center h-full">
   <EmptyStateIcon className="size-32" />
   <p>{message}</p>
   {onClick && (
    <Button
     type="button"
     variant="custom"
     onClick={onClick}
     className="h-11 text-base mt-4 max-w-[150px] w-full"
    >
     <Plus className="size-5" />
     Create
    </Button>
   )}
  </div>
 )
}