import { ArrowRightIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <PlusIcon data-icon="inline-start" />
        New project
      </Button>
      <Button variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  )
}
