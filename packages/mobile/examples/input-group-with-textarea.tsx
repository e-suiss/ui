import { ArrowUpIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export default function InputGroupWithTextarea() {
  return (
    <InputGroup>
      <InputGroupTextarea
        placeholder="Ask, search or chat..."
        numberOfLines={3}
      />
      <InputGroupAddon align="block-end" className="justify-between">
        <InputGroupText>52% used</InputGroupText>
        <InputGroupButton
          variant="default"
          size="icon-xs"
          accessibilityLabel="Send"
        >
          <Icon as={ArrowUpIcon} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
