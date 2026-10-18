import { FileTsIcon } from "phosphor-react-native"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"

const greeting = `export function Greeting({ name }: { name: string }) {
  // Say hello to the person signing in
  return <Text>Hello, {name}!</Text>
}`

export default function CodeBlockDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <Icon as={FileTsIcon} />
        <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={greeting} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="tsx">{greeting}</CodeBlockContent>
    </CodeBlock>
  )
}
