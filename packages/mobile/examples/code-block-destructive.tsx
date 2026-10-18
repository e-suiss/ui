import { TerminalIcon } from "phosphor-react-native"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"

export default function CodeBlockDestructive() {
  return (
    <CodeBlock variant="destructive" size="sm">
      <CodeBlockHeader>
        <Icon as={TerminalIcon} />
        <CodeBlockTitle>Failed to run pnpm lint</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent wrap>
        {"app/page.tsx:12:7 Unexpected any. Specify a different type."}
      </CodeBlockContent>
    </CodeBlock>
  )
}
