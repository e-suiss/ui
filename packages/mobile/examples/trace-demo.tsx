import { CheckCircleIcon, WarningCircleIcon } from "phosphor-react-native"
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
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function TraceDemo() {
  return (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Why does pnpm install fail in CI?</BubbleContent>
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
              <TraceTitle>Thought for 5s</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Text>
              CI installs with a frozen lockfile, so the install stops when
              package.json and pnpm-lock.yaml disagree.
            </Text>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine>
          <TraceIcon>
            <Icon as={CheckCircleIcon} />
          </TraceIcon>
          <TraceTitle>Ran pnpm --version</TraceTitle>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <Icon as={WarningCircleIcon} />
              </TraceIcon>
              <TraceTitle>Failed to run pnpm install</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm" variant="destructive">
              <CodeBlockContent wrap>
                ERR_PNPM_OUTDATED_LOCKFILE Cannot install with
                &quot;frozen-lockfile&quot; because pnpm-lock.yaml is not up to
                date with package.json
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      <Text>
        The last commit bumped a version in package.json without updating
        pnpm-lock.yaml. Run pnpm install locally and commit the lockfile.
      </Text>
    </View>
  )
}
