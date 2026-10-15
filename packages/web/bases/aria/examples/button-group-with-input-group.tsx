import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"

export default function ButtonGroupWithInputGroup() {
  return (
    <ButtonGroup orientation="horizontal" className="w-96">
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" aria-label="Add">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
          />
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
              <InputGroupButton size="icon-xs" aria-label="Voice mode">
                <IconPlaceholder
                  lucide="MicIcon"
                  tabler="IconMicrophone"
                  hugeicons="Mic01Icon"
                  phosphor="MicrophoneIcon"
                  remixicon="RiMicLine"
                />
              </InputGroupButton>
              <TooltipContent>Voice mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
