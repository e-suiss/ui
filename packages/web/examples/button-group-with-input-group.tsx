import { MicrophoneIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ButtonGroupWithInputGroup() {
  return (
    <ButtonGroup orientation="horizontal" className="w-96">
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="flex-1">
        <InputGroup>
          <InputGroupInput
            aria-label="Message"
            placeholder="Send a message..."
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton size="icon-xs" aria-label="Voice mode" />
                }
              >
                <MicrophoneIcon />
              </TooltipTrigger>
              <TooltipContent>Voice mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
