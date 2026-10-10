import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import {
  Panel,
  PanelBody,
  PanelClose,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  PanelTrigger,
} from "@/components/patterns/panel"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function PanelDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <View className="items-start">
      <Panel defaultOpen={defaultOpen}>
        <PanelTrigger render={<Button variant="outline" />}>
          <Text>Filters</Text>
        </PanelTrigger>
        <PanelContent>
          <PanelHeader>
            <PanelTitle>Filters</PanelTitle>
            <PanelDescription>Narrow down the results.</PanelDescription>
          </PanelHeader>
          <PanelBody>
            <Text className="text-sm text-label-secondary">
              Status, owner and date filters go here.
            </Text>
          </PanelBody>
          <PanelFooter>
            <Button>
              <Text>Apply</Text>
            </Button>
            <PanelClose render={<Button variant="secondary" />}>
              <Text>Reset</Text>
            </PanelClose>
          </PanelFooter>
        </PanelContent>
      </Panel>
    </View>
  )
}

const meta = {
  title: "Patterns/Panel",
  component: Panel,
} satisfies Meta<typeof Panel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <PanelDemo />,
}

export const OpenByDefault: Story = {
  render: () => <PanelDemo defaultOpen />,
}
