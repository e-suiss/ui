import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ArrowUpIcon,
  CopyIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Input Group",
  component: InputGroup,
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

function SearchDemo() {
  const [value, setValue] = React.useState("")
  return (
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
  )
}

export const Default: Story = {
  render: () => (
    <View className="gap-4">
      <SearchDemo />
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
  ),
}

export const WithTextarea: Story = {
  render: () => (
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
  ),
}

export const BlockStart: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="Enter your name" />
      <InputGroupAddon align="block-start">
        <Text className="text-sm font-medium text-foreground">Full name</Text>
      </InputGroupAddon>
    </InputGroup>
  ),
}
