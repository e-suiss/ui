"use client"

import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

const goal = 12000
const saved = 7450

export function SavingsGoal() {
  const [contribution, setContribution] = React.useState(500)
  const months = Math.ceil((goal - saved) / contribution)
  const projected = new Date(2026, 9 + months, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summer trip</CardTitle>
        <CardDescription>Savings goal</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <IconPlaceholder
              phosphor="AirplaneIcon"
              lucide="PlaneIcon"
              tabler="IconPlane"
              hugeicons="AirplaneIcon"
              remixicon="RiPlaneLine"
              data-icon="inline-start"
            />
            On track
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              $7,450
            </span>
            <span className="text-sm text-muted-foreground tabular-nums">
              of $12,000
            </span>
          </div>
          <Progress value={62} aria-label="Saved so far" />
          <span className="text-xs text-muted-foreground">
            62% saved · $4,550 to go
          </span>
        </div>
        <Separator />
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Monthly contribution</FieldLabel>
            <span className="text-sm font-medium tabular-nums">
              ${contribution}
            </span>
          </div>
          <Slider
            value={[contribution]}
            onValueChange={(value) =>
              setContribution(Array.isArray(value) ? (value[0] ?? 500) : value)
            }
            min={100}
            max={1500}
            step={50}
            aria-label="Monthly contribution"
          />
          <FieldDescription>
            Moved from checking on the 1st of each month.
          </FieldDescription>
        </Field>
        <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
          <IconPlaceholder
            phosphor="CalendarBlankIcon"
            lucide="CalendarIcon"
            tabler="IconCalendar"
            hugeicons="Calendar01Icon"
            remixicon="RiCalendarLine"
            className="size-5 text-muted-foreground"
          />
          <div className="flex flex-1 flex-col text-sm">
            <span className="text-muted-foreground">Projected date</span>
            <span className="font-medium">{projected}</span>
          </div>
          <span className="text-sm text-muted-foreground tabular-nums">
            {months} mo
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button block>Save changes</Button>
      </CardFooter>
    </Card>
  )
}
