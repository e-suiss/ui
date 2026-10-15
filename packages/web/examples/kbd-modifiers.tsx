import { Kbd } from "@/components/ui/kbd"

export default function KbdModifiers() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd mod />
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
    </div>
  )
}
