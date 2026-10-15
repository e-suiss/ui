import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Kbd } from "@/components/ui/kbd"

export default function KbdWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd>
        <IconPlaceholder
          lucide="CommandIcon"
          tabler="IconCommand"
          hugeicons="CommandIcon"
          phosphor="CommandIcon"
          remixicon="RiCommandLine"
        />
        K
      </Kbd>
      <Kbd>
        <IconPlaceholder
          lucide="CornerDownLeftIcon"
          tabler="IconCornerDownLeft"
          hugeicons="CornerDownLeftIcon"
          phosphor="ArrowElbowDownLeftIcon"
          remixicon="RiCornerDownLeftLine"
        />
      </Kbd>
    </div>
  )
}
