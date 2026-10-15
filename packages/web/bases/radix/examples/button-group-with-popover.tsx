import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
        <IconPlaceholder
          lucide="SparkleIcon"
          tabler="IconSparkles"
          hugeicons="SparklesIcon"
          phosphor="SparkleIcon"
          remixicon="RiSparklingLine"
          data-icon="inline-start"
        />
        Assistant
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open popover">
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
            />
          </Button>
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
