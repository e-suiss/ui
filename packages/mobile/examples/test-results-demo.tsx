import { CheckCircleIcon, FlaskIcon, XCircleIcon } from "phosphor-react-native"
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

export default function TestResultsDemo() {
  return (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Run the checkout tests.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <Icon as={FlaskIcon} />
            </TraceIcon>
            <TraceTitle>Ran 5 tests, 1 failed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <Icon as={CheckCircleIcon} />
              </TraceIcon>
              <TraceTitle>cart.test.ts</TraceTitle>
              <TraceDescription>3 passed</TraceDescription>
            </TraceLine>
            <TraceLine status="error">
              <TraceIcon>
                <Icon as={XCircleIcon} />
              </TraceIcon>
              <TraceTitle>payment.test.ts › retries a declined card</TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <Icon as={CheckCircleIcon} />
              </TraceIcon>
              <TraceTitle>payment.test.ts › charges the saved card</TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Text>The retry test expects two attempts and the client makes one.</Text>
    </View>
  )
}
