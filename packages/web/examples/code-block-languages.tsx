"use client"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"

const cssCode = `@import "tailwindcss";

:root {
  --radius: 0.625rem;
}`

const pythonCode = `def greet(name: str) -> str:
    return f"Hello, {name}!"`

const textCode = "A language that is not in the list renders as plain text."

function Sample({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

export default function CodeBlockLanguages() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/globals.css</CodeBlockTitle>
        </CodeBlockHeader>
        <Sample code={cssCode} language="css" />
      </CodeBlock>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>main.py</CodeBlockTitle>
        </CodeBlockHeader>
        <Sample code={pythonCode} language="python" />
      </CodeBlock>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>notes.txt</CodeBlockTitle>
        </CodeBlockHeader>
        <Sample code={textCode} language="text" />
      </CodeBlock>
    </div>
  )
}
