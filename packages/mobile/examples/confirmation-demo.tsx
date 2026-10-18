import { ShieldWarningIcon, TerminalIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { Message, MessageContent } from "@/components/ui/message"
import { Text } from "@/components/ui/text"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

type Decision = "pending" | "approved" | "denied"

function ConfirmationExample() {
  const [decision, setDecision] = React.useState<Decision>("pending")
  return (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Clean up the build folder.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      {decision === "pending" ? (
        <View className="gap-3">
          <Trace>
            <TraceLine>
              <TraceIcon>
                <Icon as={ShieldWarningIcon} />
              </TraceIcon>
              <TraceTitle>Wants to run a command</TraceTitle>
            </TraceLine>
          </Trace>
          <CodeBlock size="sm">
            <CodeBlockContent language="bash">rm -rf .next</CodeBlockContent>
          </CodeBlock>
          <View className="flex-row gap-2">
            <Button size="sm" onPress={() => setDecision("approved")}>
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={() => setDecision("denied")}
            >
              Deny
            </Button>
          </View>
        </View>
      ) : (
        <View className="gap-3">
          <Trace>
            <TraceLine status={decision === "denied" ? "error" : undefined}>
              <TraceIcon>
                <Icon as={TerminalIcon} />
              </TraceIcon>
              <TraceTitle>
                {decision === "approved"
                  ? "Ran rm -rf .next"
                  : "Denied rm -rf .next"}
              </TraceTitle>
            </TraceLine>
          </Trace>
          <Text>
            {decision === "approved"
              ? "Removed the build folder."
              : "Left the build folder as it is."}
          </Text>
          <View className="items-start">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setDecision("pending")}
            >
              Reset
            </Button>
          </View>
        </View>
      )}
    </View>
  )
}

export default function ConfirmationDemo() {
  return <ConfirmationExample />
}
