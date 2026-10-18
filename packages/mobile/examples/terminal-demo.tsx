import { TerminalIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
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

export default function TerminalDemo() {
  return (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Run the checks, then build the app.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <Icon as={TerminalIcon} />
          </TraceIcon>
          <TraceTitle>Ran pnpm lint</TraceTitle>
          <TraceDescription>2s</TraceDescription>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <Icon as={TerminalIcon} />
          </TraceIcon>
          <TraceTitle>Ran pnpm test</TraceTitle>
          <TraceDescription>14s</TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <Icon as={TerminalIcon} />
              </TraceIcon>
              <TraceTitle>Ran pnpm build</TraceTitle>
              <TraceDescription>38s</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent language="bash">
                {
                  "$ pnpm build\nCompiled successfully in 31s\nRoute (app)  Size\n/            4.2 kB\n/checkout    8.9 kB"
                }
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      <Text>Lint and tests pass, and the build compiled both routes.</Text>
    </View>
  )
}
