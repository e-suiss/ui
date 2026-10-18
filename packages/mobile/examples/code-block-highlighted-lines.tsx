import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block"

export default function CodeBlockHighlightedLines() {
  return (
    <CodeBlock>
      <CodeBlockContent lineNumbers>
        <CodeBlockLine>{"export default {"}</CodeBlockLine>
        <CodeBlockLine>{"  experimental: {"}</CodeBlockLine>
        <CodeBlockLine variant="highlighted">
          {"    reactCompiler: true,"}
        </CodeBlockLine>
        <CodeBlockLine variant="highlighted">
          {"    viewTransition: true,"}
        </CodeBlockLine>
        <CodeBlockLine>{"  },"}</CodeBlockLine>
        <CodeBlockLine>{"}"}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  )
}
