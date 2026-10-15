import { Trail, type TrailItem } from "@/components/patterns/trail"

const deep: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Products", href: "#products" },
  { label: "Workspace", href: "#workspace" },
  { label: "Billing", href: "#billing" },
  { label: "Invoices", href: "#invoices" },
  { label: "Download an invoice as PDF" },
]

export default function TrailCollapsed() {
  return <Trail items={deep} maxItems={4} />
}
