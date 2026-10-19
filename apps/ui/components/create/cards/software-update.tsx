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
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

export function SoftwareUpdate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Software update</CardTitle>
        <CardDescription>Version 18.2 · 1.4 GB</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <IconPlaceholder
              phosphor="SparkleIcon"
              lucide="SparkleIcon"
              tabler="IconSparkles"
              hugeicons="SparklesIcon"
              remixicon="RiSparklingLine"
              data-icon="inline-start"
            />
            New
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="flex list-disc flex-col gap-1.5 ps-5 text-muted-foreground text-sm">
          <li>Photo search that understands places.</li>
          <li>Sleep schedule with gentle alarms.</li>
          <li>Faster sync for notes and reminders.</li>
          <li>Security and battery improvements.</li>
        </ul>
        <Separator />
        <Progress value={64}>
          <ProgressLabel className="flex items-center gap-2">
            <Spinner />
            Downloading
          </ProgressLabel>
          <ProgressValue />
        </Progress>
        <p className="text-muted-foreground text-xs">
          About 6 minutes left. Stay on Wi-Fi to finish.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Later
        </Button>
        <Button className="flex-1">
          <IconPlaceholder
            phosphor="MoonIcon"
            lucide="MoonIcon"
            tabler="IconMoon"
            hugeicons="MoonIcon"
            remixicon="RiMoonLine"
            data-icon="inline-start"
          />
          Install tonight
        </Button>
      </CardFooter>
    </Card>
  )
}
