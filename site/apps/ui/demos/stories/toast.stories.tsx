// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  createToastManager,
  Toaster,
  useToastManager,
} from "@/components/ui/toast"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const managers = new Map<string, ReturnType<typeof createToastManager>>()

function managerFor(id: string) {
  const existing = managers.get(id)
  if (existing) return existing
  const manager = createToastManager()
  managers.set(id, manager)
  return manager
}

const meta = {
  title: "Components/Toast",
  component: Toaster,
  decorators: [
    (Story, context) => (
      <Toaster toastManager={managerFor(context.id)}>
        <Story />
      </Toaster>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

function DefaultExample() {
  const toast = useToastManager()

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.add({
          title: "Event created",
          description: "Friday, October 3 at 9:00 AM",
        })
      }
    >
      Show toast
    </Button>
  )
}

export const Default: Story = {
  render: () => <DefaultExample />,
  play: async ({ canvas, step }) => {
    await step("shows a titled toast with its description", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Show toast" }))
      const toast = await screen.findByRole("dialog", { name: "Event created" })
      await expect(toast).toHaveAccessibleDescription(
        "Friday, October 3 at 9:00 AM"
      )
      await expect(
        screen.getByRole("region", { name: "Notifications" })
      ).toContainElement(toast)
    })

    await step("reveals and uses the close button on hover", async () => {
      await userEvent.hover(await screen.findByText("Event created"))
      await userEvent.click(
        await screen.findByRole("button", { name: "Close toast" })
      )
      await waitFor(() =>
        expect(screen.queryByText("Event created")).toBeNull()
      )
    })
  },
}

function TypesExample() {
  const toast = useToastManager()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "success",
            title: "Changes saved",
            description: "Your profile has been updated.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "info",
            title: "New version available",
            description: "Refresh the page to get the latest features.",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "warning",
            title: "Storage almost full",
            description: "You have used 90% of your storage.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "error",
            title: "Upload failed",
            description: "The file is larger than 10 MB.",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "loading",
            title: "Uploading file",
            description: "This may take a few seconds.",
          })
        }
      >
        Loading
      </Button>
    </div>
  )
}

export const Types: Story = {
  render: () => <TypesExample />,
  play: async ({ canvas, step }) => {
    await step("stacks one toast per type", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Success" }))
      await userEvent.click(canvas.getByRole("button", { name: "Error" }))
      await expect(await screen.findByText("Changes saved")).toBeInTheDocument()
      await expect(await screen.findByText("Upload failed")).toBeInTheDocument()
    })
  },
}

function TitleOnlyExample() {
  const toast = useToastManager()

  return (
    <Button
      variant="outline"
      onClick={() => toast.add({ type: "success", title: "8 photos uploaded" })}
    >
      Upload photos
    </Button>
  )
}

export const TitleOnly: Story = {
  render: () => <TitleOnlyExample />,
  play: async ({ canvas, step }) => {
    await step("shows a toast named by its title alone", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Upload photos" })
      )
      const toast = await screen.findByRole("dialog", {
        name: "8 photos uploaded",
      })
      await expect(
        screen.getByRole("region", { name: "Notifications" })
      ).toContainElement(toast)
    })

    await step("closes from the close button", async () => {
      await userEvent.hover(await screen.findByText("8 photos uploaded"))
      await userEvent.click(
        await screen.findByRole("button", { name: "Close toast" })
      )
      await waitFor(() =>
        expect(screen.queryByText("8 photos uploaded")).toBeNull()
      )
    })
  },
}

function WithActionExample() {
  const toast = useToastManager()

  return (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.add({
          title: "Message archived",
          description: "The conversation was moved to your archive.",
          actionProps: {
            children: "Undo",
            onClick: () => toast.close(id),
          },
        })
      }}
    >
      Archive message
    </Button>
  )
}

export const WithAction: Story = {
  render: () => <WithActionExample />,
  play: async ({ canvas, step }) => {
    await step("closes the toast from its action", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Archive message" })
      )
      await userEvent.click(await screen.findByRole("button", { name: "Undo" }))
      await waitFor(() =>
        expect(screen.queryByText("Message archived")).toBeNull()
      )
    })
  },
}

function TimeoutExample() {
  const toast = useToastManager()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        onClick={() => toast.add({ title: "Link copied", timeout: 1500 })}
      >
        Short
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "warning",
            title: "Connection lost",
            description: "Stays until you close it.",
            timeout: 0,
          })
        }
      >
        Persistent
      </Button>
      <Button variant="outline" onClick={() => toast.close()}>
        Close all
      </Button>
    </div>
  )
}

export const Timeout: Story = {
  render: () => <TimeoutExample />,
  play: async ({ canvas, step }) => {
    await step("dismisses the short toast on its own", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Short" }))
      await expect(await screen.findByText("Link copied")).toBeInTheDocument()
      await waitFor(
        () => expect(screen.queryByText("Link copied")).toBeNull(),
        { timeout: 4000 }
      )
    })

    await step("keeps the persistent toast until closed", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Persistent" }))
      await expect(
        await screen.findByText("Connection lost")
      ).toBeInTheDocument()
      await userEvent.click(canvas.getByRole("button", { name: "Close all" }))
      await waitFor(() =>
        expect(screen.queryByText("Connection lost")).toBeNull()
      )
    })
  },
}

function PromiseExample({ fail = false }: { fail?: boolean }) {
  const toast = useToastManager()

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast
          .promise(
            fail
              ? wait(2000).then(() =>
                  Promise.reject(new Error("Network error"))
                )
              : wait(2000),
            {
              loading: {
                title: "Publishing post",
                description: "Hang tight, this only takes a moment.",
              },
              success: {
                title: "Post published",
                description: "Your post is now live.",
              },
              error: (error) => ({
                title: "Publishing failed",
                description:
                  error instanceof Error ? error.message : "Please try again.",
              }),
            }
          )
          .catch(() => undefined)
      }
    >
      Publish post
    </Button>
  )
}

export const PromiseToast: Story = {
  render: () => <PromiseExample />,
  play: async ({ canvas, step }) => {
    await step("moves from loading to success", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Publish post" })
      )
      await expect(
        await screen.findByText("Publishing post")
      ).toBeInTheDocument()
      await expect(
        await screen.findByText("Post published", {}, { timeout: 4000 })
      ).toBeInTheDocument()
    })
  },
}

export const PromiseRejected: Story = {
  render: () => <PromiseExample fail />,
  play: async ({ canvas, step }) => {
    await step("moves from loading to the error", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Publish post" })
      )
      await expect(
        await screen.findByText("Publishing failed", {}, { timeout: 4000 })
      ).toBeInTheDocument()
      await expect(screen.getByText("Network error")).toBeInTheDocument()
    })
  },
}
