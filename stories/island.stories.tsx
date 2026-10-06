import {
  BellIcon,
  ChatCircleIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileZipIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  Island,
  IslandCompact,
  IslandExpanded,
  IslandProvider,
  IslandRing,
  useIsland,
} from "@/components/interactions/island"
import { Button } from "@/components/ui/button"

const SIZE = 120

function NotifyButtons() {
  const { notify } = useIsland()

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          notify({
            icon: <ChatCircleIcon weight="fill" className="text-green" />,
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
            icon: <BellIcon weight="fill" className="text-orange" />,
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

function useDownload() {
  const [progress, setProgress] = React.useState<number | null>(null)
  const { notify } = useIsland()

  React.useEffect(() => {
    if (progress === null || progress >= 1) return
    const timer = window.setTimeout(
      () => setProgress((value) => Math.min((value ?? 0) + 0.01, 1)),
      150
    )
    return () => window.clearTimeout(timer)
  }, [progress])

  React.useEffect(() => {
    if (progress !== 1) return
    const timer = window.setTimeout(() => {
      setProgress(null)
      notify({
        icon: <CheckCircleIcon weight="fill" className="text-green" />,
        title: "Download complete",
        description: "Design-Kit.zip",
      })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [progress, notify])

  return {
    progress,
    start: () => setProgress(0),
    cancel: () => setProgress(null),
  }
}

function DownloadActivity({
  progress,
  onCancel,
}: {
  progress: number
  onCancel: () => void
}) {
  const done = progress >= 1
  const percent = Math.round(progress * 100)

  return (
    <>
      <IslandCompact aria-label={`Downloading Design-Kit.zip, ${percent}%`}>
        <DownloadSimpleIcon weight="bold" className="text-accent" />
        {done ? (
          <CheckCircleIcon weight="fill" className="text-green" />
        ) : (
          <IslandRing value={progress} />
        )}
      </IslandCompact>
      <IslandExpanded aria-label="Download">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface/15 dark:bg-label/15">
            <FileZipIcon weight="fill" className="size-6 text-accent" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">
              Design-Kit.zip
            </span>
            <span className="text-sm text-surface/70 tabular-nums dark:text-label-secondary">
              {done
                ? "Downloaded"
                : `${Math.round(progress * SIZE)} MB of ${SIZE} MB`}
            </span>
          </span>
          <span className="text-2xl font-semibold tabular-nums">
            {percent}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Download progress"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 overflow-hidden rounded-full bg-surface/20 dark:bg-label/20"
        >
          <div
            className="h-full origin-left rounded-full bg-accent transition-[scale] duration-300"
            style={{ scale: `${progress} 1` }}
          />
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={done}
          className="h-11 rounded-full bg-surface/15 text-sm font-semibold outline-none focus-visible:focus-ring disabled:opacity-50 dark:bg-label/15"
        >
          Cancel download
        </button>
      </IslandExpanded>
    </>
  )
}

function DownloadsExample({
  withNotifications,
}: {
  withNotifications?: boolean
}) {
  const { progress, start, cancel } = useDownload()

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
      <Island>
        {progress !== null && (
          <DownloadActivity progress={progress} onCancel={cancel} />
        )}
      </Island>
      <p className="max-w-xs text-sm text-label-secondary">
        Start a download, then tap the pill at the top to see the details.
      </p>
      <Button onClick={start} disabled={progress !== null}>
        {progress === null ? "Download Design-Kit.zip" : "Downloading…"}
      </Button>
      {withNotifications && <NotifyButtons />}
    </div>
  )
}

const meta = {
  title: "Interactions/Island",
  component: Island,
  decorators: [
    (Story) => (
      <IslandProvider>
        <Story />
      </IslandProvider>
    ),
  ],
} satisfies Meta<typeof Island>

export default meta

type Story = StoryObj<typeof meta>

export const Notification: Story = {
  render: () => (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
      <Island />
      <p className="max-w-xs text-sm text-label-secondary">
        The pill grows to show the notification and shrinks back on its own.
      </p>
      <NotifyButtons />
    </div>
  ),
}

export const LiveActivity: Story = {
  render: () => <DownloadsExample />,
}

export const ActivityWithNotifications: Story = {
  render: () => <DownloadsExample withNotifications />,
}
