import type { Meta, StoryObj } from "@storybook/react-native"
import {
  CheckCircleIcon,
  CircleIcon,
  ListChecksIcon,
  ListDashesIcon,
  RecordIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Icon } from "@/components/ui/icon"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const meta = {
  title: "AI/Queue",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Add dark mode to the settings page.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <Icon as={ListDashesIcon} />
              </TraceIcon>
              <TraceTitle>2 to do</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <TraceLine status="running">
                <TraceIcon>
                  <Icon as={RecordIcon} />
                </TraceIcon>
                <TraceTitle>Add a toggle to the settings page</TraceTitle>
              </TraceLine>
              <TraceLine status="pending">
                <TraceIcon>
                  <Icon as={CircleIcon} />
                </TraceIcon>
                <TraceTitle>Check contrast on the charts</TraceTitle>
              </TraceLine>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <Icon as={ListChecksIcon} />
              </TraceIcon>
              <TraceTitle>2 completed</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <TraceLine>
                <TraceIcon>
                  <Icon as={CheckCircleIcon} />
                </TraceIcon>
                <TraceTitle>Add a dark variant to the theme tokens</TraceTitle>
              </TraceLine>
              <TraceLine>
                <TraceIcon>
                  <Icon as={CheckCircleIcon} />
                </TraceIcon>
                <TraceTitle>Read the theme from a cookie</TraceTitle>
              </TraceLine>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </View>
  ),
}
