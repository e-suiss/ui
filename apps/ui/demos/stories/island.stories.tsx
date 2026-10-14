// @ts-nocheck
import {
  BellIcon,
  ChatCircleIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileZipIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, type screen, userEvent, waitFor } from "storybook/test"

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
const JORDAN = /Jordan Lee/
const REVIEW = /Design review/
const DOWNLOADING = /Downloading Design-Kit\.zip/

function islandOf(canvasElement: HTMLElement) {
  const island = canvasElement.querySelector<HTMLElement>("[data-slot=island]")
  if (!island) throw new Error("Island is not rendered")
  return island
}

async function startDownload(canvas: {
  getByRole: typeof screen.getByRole
  findByRole: typeof screen.findByRole
}) {
  const start = canvas.getByRole("button", { name: "Download Design-Kit.zip" })
  await userEvent.click(start)
  await expect(
    canvas.getByRole("button", { name: "Downloading…" })
  ).toBeDisabled()
  return canvas.findByRole("button", { name: DOWNLOADING })
}

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
          <IslandRing value={progress} data-visual-mask />
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
  play: async ({ canvas, canvasElement, step }) => {
    const island = islandOf(canvasElement)

    await step("stays hidden until something happens", async () => {
      await expect(island).toHaveAttribute("data-view", "hidden")
      await expect(canvas.queryByRole("button", { name: JORDAN })).toBeNull()
    })

    await step("grows to show a notification", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "New message" }))
      const notice = await canvas.findByRole("button", { name: JORDAN })
      await expect(notice).toHaveTextContent("Are we still on for Saturday?")
      await expect(island).toHaveAttribute("data-view", "notice")
    })

    await step("swaps in a newer notification", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Reminder" }))
      await expect(
        await canvas.findByRole("button", { name: REVIEW })
      ).toHaveTextContent("Starts in 10 minutes")
      await expect(canvas.queryByRole("button", { name: JORDAN })).toBeNull()
    })

    await step("shrinks back when the notification is tapped", async () => {
      await userEvent.click(canvas.getByRole("button", { name: REVIEW }))
      await waitFor(() => expect(island).toHaveAttribute("data-view", "hidden"))
      await expect(canvas.queryByRole("button", { name: REVIEW })).toBeNull()
    })
  },
}

export const LiveActivity: Story = {
  render: () => <DownloadsExample />,
  play: async ({ canvas, canvasElement, step }) => {
    const island = islandOf(canvasElement)
    let compact = canvas.getByRole("button", {
      name: "Download Design-Kit.zip",
    })

    await step("shows the activity in the compact pill", async () => {
      compact = await startDownload(canvas)
      await expect(island).toHaveAttribute("data-view", "compact")
      await expect(compact).toHaveAttribute("aria-expanded", "false")
    })

    await step(
      "expands to the details and focuses the first control",
      async () => {
        await userEvent.click(compact)
        await waitFor(() =>
          expect(island).toHaveAttribute("data-view", "expanded")
        )
        await expect(compact).toHaveAttribute("aria-expanded", "true")
        await expect(
          canvas.getByRole("progressbar", { name: "Download progress" })
        ).toBeInTheDocument()
        await waitFor(() =>
          expect(
            canvas.getByRole("button", { name: "Cancel download" })
          ).toHaveFocus()
        )
      }
    )

    await step(
      "collapses with Escape and returns focus to the pill",
      async () => {
        await userEvent.keyboard("{Escape}")
        await waitFor(() =>
          expect(island).toHaveAttribute("data-view", "compact")
        )
        await waitFor(() => expect(compact).toHaveFocus())
      }
    )

    await step("cancels the download from the expanded view", async () => {
      await userEvent.click(compact)
      await userEvent.click(
        await canvas.findByRole("button", { name: "Cancel download" })
      )
      await waitFor(() => expect(island).toHaveAttribute("data-view", "hidden"))
      await expect(
        canvas.getByRole("button", { name: "Download Design-Kit.zip" })
      ).toBeEnabled()
    })
  },
}

export const ActivityWithNotifications: Story = {
  render: () => <DownloadsExample withNotifications />,
  play: async ({ canvas, canvasElement, step }) => {
    const island = islandOf(canvasElement)

    await step("starts a live activity", async () => {
      await startDownload(canvas)
      await expect(island).toHaveAttribute("data-view", "compact")
    })

    await step("lets a notification take over the pill", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "New message" }))
      await canvas.findByRole("button", { name: JORDAN })
      await expect(island).toHaveAttribute("data-view", "notice")
      await waitFor(() =>
        expect(canvas.queryByRole("button", { name: DOWNLOADING })).toBeNull()
      )
    })

    await step(
      "returns to the activity once the notification is gone",
      async () => {
        await userEvent.click(canvas.getByRole("button", { name: JORDAN }))
        await waitFor(() =>
          expect(island).toHaveAttribute("data-view", "compact")
        )
        await expect(
          canvas.getByRole("button", { name: DOWNLOADING })
        ).toBeInTheDocument()
      }
    )
  },
}
