import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

const code = `{
  "name": "chat",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`

export default function CodeBlockLineNumbers() {
  return (
    <CodeBlock className="w-full max-w-md">
      <CodeBlockContent lineNumbers>{code}</CodeBlockContent>
    </CodeBlock>
  )
}
