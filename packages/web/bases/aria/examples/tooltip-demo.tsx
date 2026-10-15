import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="p-12">
        <Tooltip>
          <Button variant="outline">Hover me</Button>
          <TooltipContent side="top">Add to library</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
