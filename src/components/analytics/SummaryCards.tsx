import { BadgeCheck, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency } from "@/lib/helpers"
import { Card, CardDescription, CardTitle } from "../ui/card"

type SummaryCardsProps = {
 totalRevenue: number
 totalExpenses: number
 netProfit: number
 totalYardsMowed: number
}

export function SummaryCards({
 totalRevenue,
 totalExpenses,
 netProfit,
 totalYardsMowed
}: SummaryCardsProps) {
 return (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
   <Card variant="mini" className="gap-2 p-4">
    <div className="flex items-center justify-between">
     <CardDescription className="text-muted-foreground text-base">Total Revenue</CardDescription>
     <TrendingUp className="size-6" />
    </div>
    <CardTitle className="text-2xl font-medium">{formatCurrency(totalRevenue)}</CardTitle>
   </Card>
   <Card variant="mini" className="gap-2 p-4">
    <div className="flex items-center justify-between">
     <CardDescription className="text-muted-foreground text-base">Total Expenses</CardDescription>
     <TrendingDown className="size-6" />
    </div>
    <CardTitle className="text-2xl font-medium">{formatCurrency(totalExpenses)}</CardTitle>
   </Card>
   <Card variant="mini" className="gap-2 p-4">
    <div className="flex items-center justify-between">
     <CardDescription className="text-muted-foreground text-base">Net Profit</CardDescription>
     <DollarSign className="size-6" />
    </div>
    <CardTitle className="text-2xl font-medium">{formatCurrency(netProfit)}</CardTitle>
   </Card>
   <Card variant="mini" className="gap-2 p-4">
    <div className="flex items-center justify-between">
     <CardDescription className="text-muted-foreground text-base">Total Mowings</CardDescription>
     <BadgeCheck className="size-6" />
    </div>
    <CardTitle className="text-2xl font-medium">{totalYardsMowed}</CardTitle>
   </Card>
  </div>
 )
}