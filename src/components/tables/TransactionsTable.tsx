"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react"
import { formatCapitalize, formatCurrency, formatShortDate } from "@/lib/helpers"
import type { TransactionListItem } from "@/lib/queries/transactions"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { EmptyState } from "../EmptyState"

type SortOrder = "asc" | "desc"

type TransactionsTableProps = {
 transactions: TransactionListItem[]
}

const PAGE_SIZE = 15

export function TransactionsTable({ transactions }: TransactionsTableProps) {
 const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
 const [currentPage, setCurrentPage] = useState<number>(1)

 const sortedTransactions = useMemo(() => {
  return [...transactions].sort((a, b) => {
   const aTime = new Date(a.date).getTime()
   const bTime = new Date(b.date).getTime()

   return sortOrder === "asc"
    ? bTime - aTime
    : aTime - bTime
  })
 }, [transactions, sortOrder])

 const totalPages = Math.ceil(
  sortedTransactions.length / PAGE_SIZE
 )

 const paginatedTransactions = useMemo(() => {
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE

  return sortedTransactions.slice(startIndex, endIndex)
 }, [sortedTransactions, currentPage])

 const toggleSortOrder = () => {
  setSortOrder((current) =>
   current === "asc" ? "desc" : "asc"
  )

  setCurrentPage(1)
 }

 useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
   // eslint-disable-next-line react-hooks/set-state-in-effect
   setCurrentPage(totalPages)
  }
 }, [currentPage, totalPages])

 return (
  <>
   <Card className="h-full">
    <CardHeader>
     <CardTitle>Transactions</CardTitle>
    </CardHeader>
    <CardContent className="h-full">
     {transactions.length === 0 ? (
      <EmptyState message="No transactions found" />
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>
          <div
           role="button"
           onClick={toggleSortOrder}
           className="inline-flex items-center gap-1 cursor-pointer"
          >
           Date
           {sortOrder === "desc"
            ? <ArrowDown className="size-3" />
            : <ArrowUp className="size-3" />
           }
          </div>
         </TableHead>
         <TableHead>Description</TableHead>
         <TableHead>Type</TableHead>
         <TableHead className="w-[80px] text-end">Amount</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {paginatedTransactions.map((transaction) => (
         <TableRow key={transaction.id} className="h-12">
          <TableCell>{formatShortDate(transaction.date)}</TableCell>
          <TableCell>{transaction.label}</TableCell>
          <TableCell>
           <Badge
            variant={transaction.type === "revenue" ? "secondary" : "destructive"}
           >
            {formatCapitalize(transaction.type)}
           </Badge>
          </TableCell>
          <TableCell className="text-end">{formatCurrency(Number(transaction.amount))}</TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     )}
    </CardContent>
   </Card>
   {totalPages > 1 && (
    <div className="flex items-center justify-start gap-2 mt-4">
     <Button
      type="button"
      variant="outline"
      onClick={() => setCurrentPage((page) => page - 1)}
      disabled={currentPage === 1}
     >
      <ChevronLeft className="size-4" />
      Prev
     </Button>
     <Button
      type="button"
      variant="outline"
      onClick={() => setCurrentPage((page) => page + 1)}
      disabled={currentPage === totalPages}
     >
      Next
      <ChevronRight className="size-4" />
     </Button>
    </div>
   )}
  </>
 )
}