import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

const config = `export default {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}`

export default function CodeBlockLineNumbers() {
  return (
    <CodeBlock>
      <CodeBlockContent language="ts" lineNumbers>
        {config}
      </CodeBlockContent>
    </CodeBlock>
  )
}
