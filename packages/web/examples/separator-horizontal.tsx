import { Separator } from "@/components/ui/separator"

export default function SeparatorHorizontal() {
  return (
    <div className="flex w-72 flex-col gap-3 text-sm">
      <span>Recent activity</span>
      <Separator orientation="horizontal" />
      <span>Archived items</span>
    </div>
  )
}
