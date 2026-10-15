import { CaretDownIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

export default function ButtonGroupWithPopover() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button variant="outline">
        <SparkleIcon data-icon="inline-start" />
        Assistant
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Open popover" />
          }
        >
          <CaretDownIcon />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <PopoverHeader>
            <PopoverTitle>Start a new task</PopoverTitle>
            <PopoverDescription>
              Describe your task in natural language.
            </PopoverDescription>
          </PopoverHeader>
          <Textarea
            aria-label="Task description"
            placeholder="I need to..."
            className="resize-none"
          />
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}
