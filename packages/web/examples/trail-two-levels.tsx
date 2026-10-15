import { Trail, type TrailItem } from "@/components/patterns/trail"

const article: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Account", href: "#account" },
  { label: "Security", href: "#security" },
  { label: "Turn on two-factor authentication" },
]

export default function TrailTwoLevels() {
  return <Trail items={article.slice(2)} />
}
