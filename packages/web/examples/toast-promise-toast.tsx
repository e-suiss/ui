import { Button } from "@/components/ui/button"
import {
  createToastManager,
  Toaster,
  useToastManager,
} from "@/components/ui/toast"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const toastManager = createToastManager()

function PromiseExample() {
  const toast = useToastManager()

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast
          .promise(wait(2000), {
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
          })
          .catch(() => undefined)
      }
    >
      Publish post
    </Button>
  )
}

export default function ToastPromiseToast() {
  return (
    <Toaster toastManager={toastManager}>
      <PromiseExample />
    </Toaster>
  )
}
