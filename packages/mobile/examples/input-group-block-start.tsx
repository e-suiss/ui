import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Text } from "@/components/ui/text"

export default function InputGroupBlockStart() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Enter your name" />
      <InputGroupAddon align="block-start">
        <Text className="text-sm font-medium text-foreground">Full name</Text>
      </InputGroupAddon>
    </InputGroup>
  )
}
