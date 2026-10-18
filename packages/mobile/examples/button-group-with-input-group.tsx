import { MicrophoneIcon, PlusIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function ButtonGroupWithInputGroup() {
  return (
    <ButtonGroup className="self-stretch">
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="flex-1">
        <InputGroup className="flex-1">
          <InputGroupInput
            accessibilityLabel="Message"
            placeholder="Send a message..."
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" accessibilityLabel="Voice mode">
              <Icon as={MicrophoneIcon} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
