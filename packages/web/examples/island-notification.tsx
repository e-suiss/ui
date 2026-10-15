import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
            icon: (
              <IconPlaceholder
                lucide="MessageCircleIcon"
                tabler="IconMessageCircle"
                hugeicons="BubbleChatIcon"
                phosphor="ChatCircleIcon"
                remixicon="RiChat1Line"
                className="text-green-500 fill-current"
              />
            ),
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
            icon: (
              <IconPlaceholder
                lucide="BellIcon"
                tabler="IconBell"
                hugeicons="Notification03Icon"
                phosphor="BellIcon"
                remixicon="RiNotificationLine"
                className="text-orange-500 fill-current"
              />
            ),
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
