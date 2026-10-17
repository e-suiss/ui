import type { Meta, StoryObj } from "@storybook/react-native"
import { RobotIcon, TerminalIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Icon } from "@/components/ui/icon"
import { Message, MessageContent } from "@/components/ui/message"
import { Text } from "@/components/ui/text"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const meta = {
  title: "AI/Subagent",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              Find out why the images rebuild on every deploy.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Icon as={RobotIcon} />
            </TraceIcon>
            <TraceTitle>Ran the research subagent</TraceTitle>
            <TraceDescription>3 commands</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <Icon as={TerminalIcon} />
              </TraceIcon>
              <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <Icon as={TerminalIcon} />
              </TraceIcon>
              <TraceTitle>
                Ran sed -n 13,15p scripts/optimize-images.ts
              </TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <Icon as={TerminalIcon} />
              </TraceIcon>
              <TraceTitle>Ran ls public/images | wc -l</TraceTitle>
            </TraceLine>
          </Trace>
          <Text className="text-foreground">
            The cache key in scripts/optimize-images.ts includes the commit
            hash, so all 1,284 images rebuild.
          </Text>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </View>
  ),
}
