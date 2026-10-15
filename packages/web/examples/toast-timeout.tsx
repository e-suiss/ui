import { Button } from "@/components/ui/button"
import {
  createToastManager,
  Toaster,
  useToastManager,
} from "@/components/ui/toast"

const toastManager = createToastManager()

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

export default function ToastTimeout() {
  return (
    <Toaster toastManager={toastManager}>
      <TimeoutExample />
    </Toaster>
  )
}
