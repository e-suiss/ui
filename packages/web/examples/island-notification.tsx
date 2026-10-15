import { BellIcon, ChatCircleIcon } from "@phosphor-icons/react"
import {
  Island,
  IslandProvider,
  useIsland,
} from "@/components/interactions/island"
import { Button } from "@/components/ui/button"

function NotifyButtons() {
  const { notify } = useIsland()

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          notify({
            icon: <ChatCircleIcon weight="fill" className="text-green-500" />,
            title: "Jordan Lee",
            description: "Are we still on for Saturday?",
          })
        }
      >
        New message
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          notify({
            icon: <BellIcon weight="fill" className="text-orange-500" />,
            title: "Design review",
            description: "Starts in 10 minutes",
          })
        }
      >
        Reminder
      </Button>
    </div>
  )
}

export default function IslandNotification() {
  return (
    <IslandProvider>
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
        <Island />
        <p className="max-w-xs text-sm text-muted-foreground">
          The pill grows to show the notification and shrinks back on its own.
        </p>
        <NotifyButtons />
      </div>
    </IslandProvider>
  )
}
