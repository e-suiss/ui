import { Button } from "@/components/ui/button"
import {
  createToastManager,
  Toaster,
  useToastManager,
} from "@/components/ui/toast"

const toastManager = createToastManager()

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

export default function ToastWithAction() {
  return (
    <Toaster toastManager={toastManager}>
      <WithActionExample />
    </Toaster>
  )
}
