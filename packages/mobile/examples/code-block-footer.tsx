import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Text } from "@/components/ui/text"

export default function CodeBlockFooterExample() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>Logs</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value="Compiled in 4.2s" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="bash">
        {"$ pnpm build\nCompiled in 4.2s\nGenerated 12 static pages"}
      </CodeBlockContent>
      <CodeBlockFooter>
        <Text>Exited with code 0</Text>
      </CodeBlockFooter>
    </CodeBlock>
  )
}
