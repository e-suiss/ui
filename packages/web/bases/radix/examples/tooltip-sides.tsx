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
          {(["top", "right", "left", "bottom"] as const).map((side) => (
            <TooltipProvider key={side}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">{side}</Button>
                </TooltipTrigger>
                <TooltipContent side={side}>Shown on the {side}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
