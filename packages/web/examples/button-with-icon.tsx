import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="PlusSignIcon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
          data-icon="inline-start"
        />
        New project
      </Button>
      <Button variant="outline">
        Continue
        <IconPlaceholder
          lucide="ArrowRightIcon"
          tabler="IconArrowRight"
          hugeicons="ArrowRight02Icon"
          phosphor="ArrowRightIcon"
          remixicon="RiArrowRightLine"
          data-icon="inline-end"
        />
      </Button>
      <Button size="icon" aria-label="Add">
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="PlusSignIcon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
        />
      </Button>
    </div>
  )
}
