import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="p-12">
        <div className="grid grid-cols-2 place-items-center gap-x-24 gap-y-16">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">top</Button>
              </TooltipTrigger>
              <TooltipContent side="top">Shown on the top</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">right</Button>
              </TooltipTrigger>
              <TooltipContent side="right">Shown on the right</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">left</Button>
              </TooltipTrigger>
              <TooltipContent side="left">Shown on the left</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">bottom</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Shown on the bottom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </TooltipProvider>
  )
}
