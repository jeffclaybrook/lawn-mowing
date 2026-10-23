import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export function TableSkeleton({
 rows = 15,
 columns = 4
}: {
 rows?: number
 columns?: number
}) {
 return (
  <Card className="h-full">
   <CardHeader>
    <Skeleton lang="h-5.5 w-24" />
   </CardHeader>
   <CardContent>
    <Table>
     <TableHeader>
      <TableRow>
       {Array.from({ length: columns }).map((_, i) => (
        <TableHead key={i}>
         <Skeleton className="h-4 w-32" />
        </TableHead>
       ))}
      </TableRow>
     </TableHeader>
     <TableBody>
      {Array.from({ length: rows }).map((_, i) => (
       <TableRow key={i} className="h-12">
        <TableCell>
         <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
         <Skeleton className="h-4 w-48" />
        </TableCell>
        <TableCell>
         <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell className="text-end">
         <Skeleton className="size 8 ml-auto" />
        </TableCell>
       </TableRow>
      ))}
     </TableBody>
    </Table>
   </CardContent>
  </Card>
 )
}