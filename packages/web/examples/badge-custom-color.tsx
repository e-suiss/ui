import { Badge } from "@/components/ui/badge"

export default function BadgeCustomColor() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge className="text-orange-700 dark:text-orange-400">New</Badge>
      <Badge className="text-green-600 dark:text-green-400">Available</Badge>
    </div>
  )
}
