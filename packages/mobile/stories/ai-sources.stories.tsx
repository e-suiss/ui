import type { Meta, StoryObj } from "@storybook/react-native"
import { ArrowUpRightIcon, GlobeIcon } from "phosphor-react-native"
import { Linking, Pressable, View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Icon } from "@/components/ui/icon"
import { Message, MessageContent } from "@/components/ui/message"
import { Text } from "@/components/ui/text"
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
  title: "AI/Sources",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const sources = [
  {
    title: "Install Astro | docs.astro.build",
    url: "https://docs.astro.build/en/install-and-setup/",
  },
  {
    title: "create-astro | npmjs.com",
    url: "https://www.npmjs.com/package/create-astro",
  },
  { title: "pnpm create | pnpm.io", url: "https://pnpm.io/cli/create" },
]

export const Default: Story = {
  render: () => (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How do I start a new Astro project?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Icon as={GlobeIcon} />
            </TraceIcon>
            <TraceTitle>Used 3 sources</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {sources.map((source) => (
              <Pressable
                key={source.url}
                accessibilityRole="link"
                onPress={() => Linking.openURL(source.url)}
                className="self-start active:opacity-70"
              >
                <TraceLine>
                  <TraceIcon>
                    <Icon as={GlobeIcon} />
                  </TraceIcon>
                  <TraceTitle>{source.title}</TraceTitle>
                  <TraceIcon>
                    <Icon as={ArrowUpRightIcon} />
                  </TraceIcon>
                </TraceLine>
              </Pressable>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Text>Run pnpm create astro and follow the prompts.</Text>
    </View>
  ),
}
