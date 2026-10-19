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
        <PopoverTrigger render={<Button variant="outline" />}>
          Top
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
        <PopoverTrigger render={<Button variant="outline" />}>
          Right
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
        <PopoverTrigger render={<Button variant="outline" />}>
          Bottom
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
        <PopoverTrigger render={<Button variant="outline" />}>
          Left
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
