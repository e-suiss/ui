import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="secondary">
        <IconPlaceholder
          lucide="CircleCheckIcon"
          tabler="IconCircleCheck"
          hugeicons="CheckmarkCircle02Icon"
          phosphor="CheckCircleIcon"
          remixicon="RiCheckboxCircleLine"
          data-icon="inline-start"
        />
        Verified
      </Badge>
      <Badge variant="outline">
        Changelog
        <IconPlaceholder
          lucide="ArrowUpRightIcon"
          tabler="IconArrowUpRight"
          hugeicons="ArrowUpRight01Icon"
          phosphor="ArrowUpRightIcon"
          remixicon="RiArrowRightUpLine"
          data-icon="inline-end"
        />
      </Badge>
    </div>
  )
}
