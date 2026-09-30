import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Toaster, toast } from "@/components/ui/toast"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const meta = {
  title: "Components/Toast",
  component: Toaster,
  decorators: [
    (Story) => (
      <Toaster>
        <Story />
      </Toaster>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
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
  ),
}

export const Types: Story = {
  render: () => (
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
  ),
}

export const WithAction: Story = {
  render: () => (
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
  ),
}

export const PromiseToast: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(wait(2000), {
          loading: {
            title: "Publishing post",
            description: "Hang tight, this only takes a moment.",
          },
          success: {
            title: "Post published",
            description: "Your post is now live.",
          },
          error: {
            title: "Publishing failed",
            description: "Please try again.",
          },
        })
      }
    >
      Publish post
    </Button>
  ),
}
