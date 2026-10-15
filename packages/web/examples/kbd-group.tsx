import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function KbdGroupExample() {
  return (
    <div className="text-label-secondary flex flex-col items-start gap-3 text-sm">
      <p>
        Use{" "}
        <KbdGroup>
          <Kbd mod />
          <span>+</span>
          <Kbd>B</Kbd>
        </KbdGroup>{" "}
        to toggle the sidebar.
      </p>
      <KbdGroup>
        <Kbd mod />
        <Kbd>⇧</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </div>
  )
}
