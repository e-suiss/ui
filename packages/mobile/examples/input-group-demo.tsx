import { CopyIcon, MagnifyingGlassIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

export default function InputGroupDemo() {
  const [value, setValue] = React.useState("")
  return (
    <View className="gap-4">
      <InputGroup>
        <InputGroupInput
          placeholder="Search"
          value={value}
          onValueChange={setValue}
        />
        <InputGroupAddon>
          <Icon as={MagnifyingGlassIcon} />
        </InputGroupAddon>
        {value ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              accessibilityLabel="Clear"
              onPress={() => setValue("")}
            >
              <Icon as={XIcon} />
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" autoCapitalize="none" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput defaultValue="sk_live_51H8" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" accessibilityLabel="Copy">
            <Icon as={CopyIcon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Searching..." />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup invalid>
        <InputGroupInput defaultValue="not-an-email" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Invalid</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup disabled>
        <InputGroupInput placeholder="Disabled" />
        <InputGroupAddon>
          <Icon as={MagnifyingGlassIcon} />
        </InputGroupAddon>
      </InputGroup>
    </View>
  )
}
