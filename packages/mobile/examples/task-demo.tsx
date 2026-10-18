import {
  CheckCircleIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
  NotePencilIcon,
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

export default function TaskDemo() {
  return (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Update the page titles for the docs.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <Icon as={CheckCircleIcon} />
              </TraceIcon>
              <TraceTitle>Found the project files</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <TraceLine>
                <TraceIcon>
                  <Icon as={MagnifyingGlassIcon} />
                </TraceIcon>
                <TraceTitle>Searched for generateMetadata</TraceTitle>
                <TraceDescription>6 results</TraceDescription>
              </TraceLine>
              <TraceLine>
                <TraceIcon>
                  <Icon as={FileTextIcon} />
                </TraceIcon>
                <TraceTitle>Read app/docs/layout.tsx</TraceTitle>
              </TraceLine>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <Icon as={CheckCircleIcon} />
              </TraceIcon>
              <TraceTitle>Updated the page metadata</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <TraceLine>
                <TraceIcon>
                  <Icon as={NotePencilIcon} />
                </TraceIcon>
                <TraceTitle>Edited app/docs/[slug]/page.tsx</TraceTitle>
                <TraceDescription>+8 −3</TraceDescription>
              </TraceLine>
              <TraceLine>
                <TraceIcon>
                  <Icon as={NotePencilIcon} />
                </TraceIcon>
                <TraceTitle>Edited app/docs/layout.tsx</TraceTitle>
                <TraceDescription>+2 −1</TraceDescription>
              </TraceLine>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      <Text>Each docs page now builds its title from the page name.</Text>
    </View>
  )
}
