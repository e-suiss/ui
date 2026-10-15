import { Button } from "@/components/ui/button"
import {
  createToastManager,
  Toaster,
  useToastManager,
} from "@/components/ui/toast"

const toastManager = createToastManager()

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

export default function ToastTitleOnly() {
  return (
    <Toaster toastManager={toastManager}>
      <TitleOnlyExample />
    </Toaster>
  )
}
