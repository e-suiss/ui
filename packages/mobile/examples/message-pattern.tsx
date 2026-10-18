import {
  ArrowClockwiseIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { Message, MessageContent } from "@/components/ui/message"
import { Text } from "@/components/ui/text"

const command = "npx @esuiss/ui@latest add dialog"

export default function MessagePattern() {
  return (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How do I add a dialog?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <View className="gap-3">
        <Text>Add it with the CLI, then import it where you need it.</Text>
        <CodeBlock size="sm">
          <CodeBlockHeader>
            <CodeBlockTitle>Terminal</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={command} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent language="bash">{command}</CodeBlockContent>
        </CodeBlock>
        <View className="flex-row gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            accessibilityLabel="Good reply"
          >
            <Icon as={ThumbsUpIcon} />
          </Button>
          <Button variant="ghost" size="icon-sm" accessibilityLabel="Bad reply">
            <Icon as={ThumbsDownIcon} />
          </Button>
          <Button variant="ghost" size="icon-sm" accessibilityLabel="Retry">
            <Icon as={ArrowClockwiseIcon} />
          </Button>
        </View>
      </View>
    </View>
  )
}
