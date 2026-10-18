import {
  FileTextIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
} from "phosphor-react-native"
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

export default function ChainOfThoughtDemo() {
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
            <TraceTitle>Researched in 3 steps</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <Icon as={FileTextIcon} />
              </TraceIcon>
              <TraceTitle>Read the build log for dpl_8Kx2</TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <Icon as={GlobeIcon} />
              </TraceIcon>
              <TraceTitle>
                Searched the web for next.js image cache key
              </TraceTitle>
              <TraceDescription>2 sources</TraceDescription>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <Icon as={MagnifyingGlassIcon} />
              </TraceIcon>
              <TraceTitle>Searched the code for cacheKey</TraceTitle>
              <TraceDescription>3 results</TraceDescription>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Text>
        Image optimization reruns on every deploy because its cache key includes
        the commit hash. Key it on the lockfile instead.
      </Text>
    </View>
  )
}
