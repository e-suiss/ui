import { Separator } from "@/components/ui/separator"

export default function SeparatorVertical() {
  return (
    <div className="flex h-6 items-center gap-4 text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Changelog</span>
    </div>
  )
}
