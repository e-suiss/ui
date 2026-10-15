import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

export default function TooltipWithShortcut() {
  return (
    <TooltipProvider>
      <div className="p-12">
        <Tooltip>
          <Button variant="outline" size="icon" aria-label="New file">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </Button>
          <TooltipContent side="top">
            New file
            <Kbd mod>N</Kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
