import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>Your last five payments</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Corner Bakery</div>
                <div className="text-xs text-muted-foreground">Oct 18</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Paid</Badge>
              </TableCell>
              <TableCell className="text-end tabular-nums">$12.40</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">City Transit</div>
                <div className="text-xs text-muted-foreground">Oct 17</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Paid</Badge>
              </TableCell>
              <TableCell className="text-end tabular-nums">$2.90</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Northwind Energy</div>
                <div className="text-xs text-muted-foreground">Oct 16</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">Pending</Badge>
              </TableCell>
              <TableCell className="text-end tabular-nums">$84.15</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Green Market</div>
                <div className="text-xs text-muted-foreground">Oct 15</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Paid</Badge>
              </TableCell>
              <TableCell className="text-end tabular-nums">$46.72</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Studio Gym</div>
                <div className="text-xs text-muted-foreground">Oct 14</div>
              </TableCell>
              <TableCell>
                <Badge variant="destructive">Failed</Badge>
              </TableCell>
              <TableCell className="text-end tabular-nums">$39.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
