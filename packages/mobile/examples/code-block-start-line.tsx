import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const _config = `export default {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}`

export default function CodeBlockStartLine() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>next.config.ts</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers startLine={12}>
        <CodeBlockLine>{"  images: {"}</CodeBlockLine>
        <CodeBlockLine>{"    unoptimized: true,"}</CodeBlockLine>
        <CodeBlockLine>{"  },"}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  )
}
