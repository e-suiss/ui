import {
  ArrowUpIcon,
  CheckCircleIcon,
  PlusIcon,
  TerminalIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Message, MessageContent } from "@/components/ui/message"
import { Text } from "@/components/ui/text"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export default function ChatDemo() {
  return (
    <View className="w-full gap-5">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              Default the theme to the system setting.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <View className="gap-3">
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={TerminalIcon} />
            </TraceIcon>
            <TraceTitle>Ran rg -n defaultTheme app/layout.tsx</TraceTitle>
          </TraceLine>
        </Trace>
        <Text>It was set to light. I updated the ThemeProvider:</Text>
        <CodeBlock size="sm">
          <CodeBlockContent language="tsx">
            {'<ThemeProvider defaultTheme="system" enableSystem>'}
          </CodeBlockContent>
        </CodeBlock>
      </View>
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Run the build before I ship it.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <View className="gap-3">
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={CheckCircleIcon} />
            </TraceIcon>
            <TraceTitle>Ran pnpm build</TraceTitle>
          </TraceLine>
        </Trace>
        <Text>The build passes, so it is ready to ship.</Text>
      </View>
      <InputGroup>
        <InputGroupTextarea placeholder="Ask the agent..." numberOfLines={2} />
        <InputGroupAddon align="block-end" className="justify-between">
          <InputGroupButton size="icon-xs" accessibilityLabel="Attach a file">
            <Icon as={PlusIcon} />
          </InputGroupButton>
          <InputGroupButton
            variant="default"
            size="icon-xs"
            accessibilityLabel="Send"
          >
            <Icon as={ArrowUpIcon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </View>
  )
}
