import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover"

export default function PopoverSides() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <Button variant="outline">
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </Button>
          <PopoverContent side={side} className="w-56">
            <PopoverHeader>
              <PopoverTitle>Heads up</PopoverTitle>
              <PopoverDescription>
                This popover opens on the {side} side.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
