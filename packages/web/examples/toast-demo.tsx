import { Button } from "@/components/ui/button"
import {
  createToastManager,
  Toaster,
  useToastManager,
} from "@/components/ui/toast"

const toastManager = createToastManager()

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

export default function ToastDemo() {
  return (
    <Toaster toastManager={toastManager}>
      <DefaultExample />
    </Toaster>
  )
}
