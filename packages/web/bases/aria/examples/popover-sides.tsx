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
      <Popover>
        <Button variant="outline">Top</Button>
        <PopoverContent side="top" className="w-56">
          <PopoverHeader>
            <PopoverTitle>Heads up</PopoverTitle>
            <PopoverDescription>
              This popover opens on the top side.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <Popover>
        <Button variant="outline">Right</Button>
        <PopoverContent side="right" className="w-56">
          <PopoverHeader>
            <PopoverTitle>Heads up</PopoverTitle>
            <PopoverDescription>
              This popover opens on the right side.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <Popover>
        <Button variant="outline">Bottom</Button>
        <PopoverContent side="bottom" className="w-56">
          <PopoverHeader>
            <PopoverTitle>Heads up</PopoverTitle>
            <PopoverDescription>
              This popover opens on the bottom side.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <Popover>
        <Button variant="outline">Left</Button>
        <PopoverContent side="left" className="w-56">
          <PopoverHeader>
            <PopoverTitle>Heads up</PopoverTitle>
            <PopoverDescription>
              This popover opens on the left side.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}
