import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "../ui/Card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent
} from "../ui/Chart"


import { firebaseService } from "../../lib/firebaseService"

const chartConfig = {
  expensesCount: {
    label: "Expenses Count",
    color: "hsl(var(--chart-1))", // Consider using a different color for better distinction
  },
  expensesAmount: {
    label: "Expenses Total Amount",
    color: "hsl(var(--chart-2)", // Changed to blue for better distinction
  },
}

export default function ExpensesAndamount() {
  const [chartData, setChartData] = useState([])
  const [setExpensesTable] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { getExpenses } = firebaseService()
      const expenses = await getExpenses()
      console.log("Expenses:", expenses)

      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const validExpenses = expenses.filter(e => e.month)

      // Calculate total expenses count and amount for each month
      const data = months.map((month) => ({
        month,
        expensesCount: validExpenses.filter(e => e.month === month).length, // Count expenses
        expensesAmount: validExpenses.reduce((total, e) => e.month === month ? total + e.amount : total, 0), // Sum amounts
      }))

      setChartData(data)
      setExpensesTable(expenses) // Save full expense objects
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Expenses Count with the Total of Amount</CardTitle>
          <CardDescription>Monthly Data</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="expensesCount" name="Expenses Count" fill={chartConfig.expensesCount.color} radius={4} />
              <Bar dataKey="expensesAmount" name="Expenses Amount" fill={chartConfig.expensesAmount.color} radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total for the whole months
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
