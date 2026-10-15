import { ArrowUpRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="secondary">
        <CheckCircleIcon data-icon="inline-start" />
        Verified
      </Badge>
      <Badge variant="outline">
        Changelog
        <ArrowUpRightIcon data-icon="inline-end" />
      </Badge>
    </div>
  )
}
