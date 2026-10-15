import { DotsThreeIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardWithAction() {
  return (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle>Monthly revenue</CardTitle>
          <CardDescription>Updated five minutes ago</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon-sm" aria-label="More options">
              <DotsThreeIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tabular-nums">$24,380</p>
        </CardContent>
      </Card>
    </div>
  )
}
