import type { Meta, StoryObj } from "@storybook/react-native"
import { WarningCircleIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { Message, MessageContent } from "@/components/ui/message"
import { Text } from "@/components/ui/text"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const meta = {
  title: "AI/Stack Trace",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Reset the database and seed it.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <Icon as={WarningCircleIcon} />
            </TraceIcon>
            <TraceTitle>Failed to run pnpm db:seed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm" variant="destructive">
            <CodeBlockContent wrap>
              {
                "TypeError: Cannot read properties of undefined (reading 'id')\n  at seedOrders (scripts/seed.ts:42:18)\n  at main (scripts/seed.ts:12:3)"
              }
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Text>
        The seed reads a customer before it is created. Seeding customers first
        fixes the order step.
      </Text>
    </View>
  ),
}
