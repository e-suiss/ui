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
              <TooltipTrigger render={<Button variant="outline" />}>
                top
              </TooltipTrigger>
              <TooltipContent side="top">Shown on the top</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                right
              </TooltipTrigger>
              <TooltipContent side="right">Shown on the right</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                left
              </TooltipTrigger>
              <TooltipContent side="left">Shown on the left</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                bottom
              </TooltipTrigger>
              <TooltipContent side="bottom">Shown on the bottom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </TooltipProvider>
  )
}
