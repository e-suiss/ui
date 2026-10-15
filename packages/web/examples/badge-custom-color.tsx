import { Badge } from "@/components/ui/badge"

export default function BadgeCustomColor() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge className="text-orange-700 dark:text-orange-400">New</Badge>
      <Badge className="text-success">Available</Badge>
    </div>
  )
}
