import { ArrowUpIcon, CopyIcon, PaperclipIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Text } from "@/components/ui/text"

export default function InputGroupButtonSizes() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Type a command..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="xs">
          <Text>Extra small</Text>
        </InputGroupButton>
        <InputGroupButton size="icon-xs" accessibilityLabel="Copy">
          <Icon as={CopyIcon} />
        </InputGroupButton>
        <InputGroupButton size="icon-sm" accessibilityLabel="Attach">
          <Icon as={PaperclipIcon} />
        </InputGroupButton>
        <InputGroupButton
          variant="default"
          size="icon"
          accessibilityLabel="Send"
        >
          <Icon as={ArrowUpIcon} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
