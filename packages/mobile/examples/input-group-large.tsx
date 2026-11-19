import { CaretRightIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Text } from "@/components/ui/text"

export default function InputGroupLarge() {
  return (
    <InputGroup size="lg">
      <InputGroupAddon>
        <Text className="text-foreground">+90</Text>
        <View className="ms-1 me-1.5 h-5.5 w-px bg-border" />
      </InputGroupAddon>
      <InputGroupInput
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        accessibilityLabel="Phone number"
        placeholder="555 123 45 67"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          variant="default"
          size="icon"
          accessibilityLabel="Continue"
        >
          <Icon as={CaretRightIcon} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
