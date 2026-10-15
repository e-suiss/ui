import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
              <IconPlaceholder
                lucide="EllipsisIcon"
                tabler="IconDots"
                hugeicons="MoreHorizontalIcon"
                phosphor="DotsThreeIcon"
                remixicon="RiMoreLine"
              />
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
