import { Button } from "@/components/ui/button"
import {
  createToastManager,
  Toaster,
  useToastManager,
} from "@/components/ui/toast"

const toastManager = createToastManager()

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

export default function ToastTypes() {
  return (
    <Toaster toastManager={toastManager}>
      <TypesExample />
    </Toaster>
  )
}
