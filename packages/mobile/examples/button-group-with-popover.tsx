import { CaretDownIcon, SparkleIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"

export default function ButtonGroupWithPopover() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <Icon as={SparkleIcon} />
        <Text>Assistant</Text>
      </Button>
      <Popover>
        <PopoverTrigger
          accessibilityLabel="Open popover"
          render={<Button variant="outline" size="icon" />}
        >
          <Icon as={CaretDownIcon} />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <PopoverHeader>
            <PopoverTitle>Start a new task</PopoverTitle>
            <PopoverDescription>
              Describe your task in natural language.
            </PopoverDescription>
          </PopoverHeader>
          <Textarea
            accessibilityLabel="Task description"
            placeholder="I need to..."
          />
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}
