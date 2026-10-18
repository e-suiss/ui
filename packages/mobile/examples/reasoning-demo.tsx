import { BrainIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
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

export default function ReasoningDemo() {
  return (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Why is the checkout deploy so slow?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Icon as={BrainIcon} />
            </TraceIcon>
            <TraceTitle>Thought for 5s</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Text>
            The build log shows install and compile finish in under a minute.
            Image optimization takes almost four, and it reruns on every deploy
            because the cache key includes the commit hash.
          </Text>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Text>
        Image optimization is the bottleneck. Key its cache on the lockfile and
        the image directory instead of the commit hash.
      </Text>
    </View>
  )
}
