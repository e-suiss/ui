import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

export function StorageUsage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>
          <span className="font-medium text-foreground tabular-nums">
            98.4 GB
          </span>{" "}
          of 128 GB used
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
            <div className="w-[38%] bg-(--chart-1)" />
            <div className="w-[21%] bg-(--chart-2)" />
            <div className="w-[9%] bg-(--chart-3)" />
            <div className="w-[9%] bg-(--chart-4)" />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-(--chart-1)" />
              Photos
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-(--chart-2)" />
              Apps
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-(--chart-3)" />
              Messages
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-(--chart-4)" />
              System
            </span>
          </div>
        </div>
        <ItemGroup variant="inset">
          <Item size="sm">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="SparkleIcon"
                lucide="SparkleIcon"
                tabler="IconSparkles"
                hugeicons="SparklesIcon"
                remixicon="RiSparklingLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Optimize photos</ItemTitle>
              <ItemDescription>Save up to 22 GB</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item size="sm">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="SquaresFourIcon"
                lucide="LayoutGridIcon"
                tabler="IconLayoutGrid"
                hugeicons="GridViewIcon"
                remixicon="RiLayoutGridLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Offload apps</ItemTitle>
              <ItemDescription>11 unused for 60 days</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item size="sm">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="ChatCircleIcon"
                lucide="MessageCircleIcon"
                tabler="IconMessageCircle"
                hugeicons="BubbleChatIcon"
                remixicon="RiChat1Line"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Large attachments</ItemTitle>
              <ItemDescription>3.6 GB in conversations</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
