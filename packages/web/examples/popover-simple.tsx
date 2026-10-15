import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PopoverSimple() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" />}>
        What is this?
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p>
          Shared links stay active for 30 days and can be revoked at any time
          from settings.
        </p>
      </PopoverContent>
    </Popover>
  )
}
