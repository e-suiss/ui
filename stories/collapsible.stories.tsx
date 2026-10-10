import type { Meta, StoryObj } from "@storybook/react-native"
import { CaretUpDownIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const repositories = ["@esuiss/ui", "@esuiss/uim", "@esuiss/icons"]

function CollapsibleDemo({
  initialOpen = false,
  disabled = false,
}: {
  initialOpen?: boolean
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(initialOpen)
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      className="w-full gap-2"
    >
      <View className="flex-row items-center justify-between gap-4 px-4">
        <Text className="text-sm font-semibold">3 starred repositories</Text>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon" disabled={disabled}>
              <Icon as={CaretUpDownIcon} className="size-4" />
            </Button>
          }
        />
      </View>
      <View className="border-border rounded-md border px-4 py-3">
        <Text className="font-mono text-sm">{repositories[0]}</Text>
      </View>
      <CollapsibleContent className="gap-2">
        {repositories.slice(1).map((repository) => (
          <View
            key={repository}
            className="border-border rounded-md border px-4 py-3"
          >
            <Text className="font-mono text-sm">{repository}</Text>
          </View>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <CollapsibleDemo />,
}

export const OpenByDefault: Story = {
  render: () => <CollapsibleDemo initialOpen />,
}

export const Disabled: Story = {
  render: () => <CollapsibleDemo disabled />,
}
