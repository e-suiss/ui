import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block"

const code = `export default {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}`

const highlighted = [2, 3]

export default function CodeBlockHighlightedLines() {
  return (
    <CodeBlock className="w-full max-w-md">
      <CodeBlockContent lineNumbers>
        {code.split("\n").map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={highlighted.includes(index) ? "highlighted" : "default"}
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}
