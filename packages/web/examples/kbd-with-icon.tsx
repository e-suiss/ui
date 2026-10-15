import { ArrowElbowDownLeftIcon, CommandIcon } from "@phosphor-icons/react"
import { Kbd } from "@/components/ui/kbd"

export default function KbdWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd>
        <CommandIcon />K
      </Kbd>
      <Kbd>
        <ArrowElbowDownLeftIcon />
      </Kbd>
    </div>
  )
}
