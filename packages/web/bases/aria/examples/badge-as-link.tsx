import { Badge } from "@/components/ui/badge"

export default function BadgeAsLink() {
  return (
    <Badge render={(props) => <a href="#documentation" {...props} />}>
      Documentation
    </Badge>
  )
}
