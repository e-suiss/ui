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

export default function SourcesDemo() {
  return (
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
            <Pressable
              accessibilityRole="link"
              onPress={() =>
                Linking.openURL(
                  "https://docs.astro.build/en/install-and-setup/"
                )
              }
              className="self-start active:opacity-70"
            >
              <TraceLine>
                <TraceIcon>
                  <Icon as={GlobeIcon} />
                </TraceIcon>
                <TraceTitle>Install Astro | docs.astro.build</TraceTitle>
                <TraceIcon>
                  <Icon as={ArrowUpRightIcon} />
                </TraceIcon>
              </TraceLine>
            </Pressable>
            <Pressable
              accessibilityRole="link"
              onPress={() =>
                Linking.openURL("https://www.npmjs.com/package/create-astro")
              }
              className="self-start active:opacity-70"
            >
              <TraceLine>
                <TraceIcon>
                  <Icon as={GlobeIcon} />
                </TraceIcon>
                <TraceTitle>create-astro | npmjs.com</TraceTitle>
                <TraceIcon>
                  <Icon as={ArrowUpRightIcon} />
                </TraceIcon>
              </TraceLine>
            </Pressable>
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL("https://pnpm.io/cli/create")}
              className="self-start active:opacity-70"
            >
              <TraceLine>
                <TraceIcon>
                  <Icon as={GlobeIcon} />
                </TraceIcon>
                <TraceTitle>pnpm create | pnpm.io</TraceTitle>
                <TraceIcon>
                  <Icon as={ArrowUpRightIcon} />
                </TraceIcon>
              </TraceLine>
            </Pressable>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Text>Run pnpm create astro and follow the prompts.</Text>
    </View>
  )
}
