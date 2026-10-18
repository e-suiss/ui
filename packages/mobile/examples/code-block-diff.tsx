import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const _greeting = `export function Greeting({ name }: { name: string }) {
  // Say hello to the person signing in
  return <Text>Hello, {name}!</Text>
}`

export default function CodeBlockDiff() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent>
        <CodeBlockLine>
          {"export function Greeting({ name }: { name: string }) {"}
        </CodeBlockLine>
        <CodeBlockLine variant="removed">
          {"  return <Text>Hello, {name}</Text>"}
        </CodeBlockLine>
        <CodeBlockLine variant="added">
          {'  return <Text variant="muted">'}
        </CodeBlockLine>
        <CodeBlockLine variant="added">{"    Hello, {name}!"}</CodeBlockLine>
        <CodeBlockLine variant="added">{"  </Text>"}</CodeBlockLine>
        <CodeBlockLine>{"}"}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  )
}
