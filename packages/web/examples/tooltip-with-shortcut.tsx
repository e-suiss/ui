import { PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TooltipWithShortcut() {
  return (
    <TooltipProvider>
      <div className="p-12">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="outline" size="icon" aria-label="New file" />
            }
          >
            <PlusIcon />
          </TooltipTrigger>
          <TooltipContent side="top">
            New file
            <Kbd mod>N</Kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
