import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerInButton() {
  return (
    <div className="flex items-center gap-3">
      <Button isDisabled>
        <Spinner data-icon="inline-start" />
        Saving
      </Button>
      <Button variant="outline" isDisabled>
        <Spinner data-icon="inline-start" />
        Loading more
      </Button>
    </div>
  )
}
