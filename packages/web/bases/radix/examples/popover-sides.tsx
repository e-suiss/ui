import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PopoverSides() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
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
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
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
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
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
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
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
