import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  InputAccessoryBar,
  InputAccessoryBarInput,
  useInputAccessoryBarInput,
} from "@/components/ui/input-accessory-bar"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"

function Field({ label, autoFocus }: { label: string; autoFocus?: boolean }) {
  return (
    <View className="gap-1.5">
      <Text variant="small">{label}</Text>
      <InputAccessoryBarInput placeholder={label} autoFocus={autoFocus} />
    </View>
  )
}

function MessageField() {
  const accessory = useInputAccessoryBarInput()
  return (
    <View className="gap-1.5">
      <Text variant="small">Message</Text>
      <Textarea
        placeholder="Message"
        ref={accessory.ref}
        inputAccessoryViewID={accessory.inputAccessoryViewID}
        onFocus={accessory.onFocus}
        onBlur={accessory.onBlur}
      />
    </View>
  )
}

function Form({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <KeyboardScrollView className="-m-4" contentContainerClassName="gap-4 p-4">
      <Field label="Name" autoFocus={autoFocus} />
      <Field label="Email" />
      <Field label="Phone" />
      <Field label="City" />
    </KeyboardScrollView>
  )
}

const meta = {
  title: "Components/Input Accessory Bar",
  component: InputAccessoryBar,
} satisfies Meta<typeof InputAccessoryBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <InputAccessoryBar>
      <Form />
    </InputAccessoryBar>
  ),
}

export const Focused: Story = {
  render: () => (
    <InputAccessoryBar>
      <Form autoFocus />
    </InputAccessoryBar>
  ),
}

export const CustomLabels: Story = {
  render: () => (
    <InputAccessoryBar
      previousLabel="Back"
      nextLabel="Forward"
      doneLabel="Close"
    >
      <Form autoFocus />
    </InputAccessoryBar>
  ),
}

function DoneLogDemo() {
  const [log, setLog] = React.useState("Tap Done.")
  return (
    <InputAccessoryBar onDone={() => setLog("Done pressed")}>
      <KeyboardScrollView
        className="-m-4"
        contentContainerClassName="gap-4 p-4"
      >
        <Field label="Subject" autoFocus />
        <MessageField />
        <Text role="status" className="text-sm text-muted-foreground">
          {log}
        </Text>
      </KeyboardScrollView>
    </InputAccessoryBar>
  )
}

export const WithTextarea: Story = {
  render: () => <DoneLogDemo />,
}
