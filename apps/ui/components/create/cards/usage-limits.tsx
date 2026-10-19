"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export function UsageLimits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Resets on November 1.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Starter plan</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Progress value={72}>
          <ProgressLabel>Requests</ProgressLabel>
          <ProgressValue className="ms-auto text-muted-foreground tabular-nums">
            {() => "720K / 1M"}
          </ProgressValue>
        </Progress>
        <Progress value={41}>
          <ProgressLabel>Storage</ProgressLabel>
          <ProgressValue className="ms-auto text-muted-foreground tabular-nums">
            {() => "4.1 GB / 10 GB"}
          </ProgressValue>
        </Progress>
        <Progress value={93}>
          <ProgressLabel>Bandwidth</ProgressLabel>
          <ProgressValue className="ms-auto text-muted-foreground tabular-nums">
            {() => "93 GB / 100 GB"}
          </ProgressValue>
        </Progress>
        <Progress value={80}>
          <ProgressLabel>Seats</ProgressLabel>
          <ProgressValue className="ms-auto text-muted-foreground tabular-nums">
            {() => "4 / 5"}
          </ProgressValue>
        </Progress>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Button>Upgrade to Pro</Button>
        <p className="text-center text-xs text-muted-foreground">
          Bandwidth is almost used up this cycle.
        </p>
      </CardFooter>
    </Card>
  )
}
