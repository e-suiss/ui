"use client"

import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"

const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "You are a helpful assistant. Answer in one short paragraph.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`

function download(value: string, filename: string) {
  const url = URL.createObjectURL(new Blob([value], { type: "text/plain" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function CodeBlockDemo() {
  const [wrap, setWrap] = React.useState(false)
  const lines = useHighlightedCode(code, "ts")

  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <IconPlaceholder
            lucide="FileCodeIcon"
            tabler="IconFileCode"
            hugeicons="FileCodeIcon"
            phosphor="FileCodeIcon"
            remixicon="RiFileCodeLine"
          />
          app/api/chat/route.ts
        </CodeBlockTitle>
        <CodeBlockActions>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Wrap lines"
            aria-pressed={wrap}
            className="aria-pressed:text-foreground"
            onClick={() => setWrap(!wrap)}
          >
            <IconPlaceholder
              lucide="WrapTextIcon"
              tabler="IconTextWrap"
              hugeicons="TextWrapIcon"
              phosphor="TextIndentIcon"
              remixicon="RiTextWrap"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Download"
            onClick={() => download(code, "route.ts")}
          >
            <IconPlaceholder
              lucide="DownloadIcon"
              tabler="IconDownload"
              hugeicons="Download01Icon"
              phosphor="DownloadSimpleIcon"
              remixicon="RiDownloadLine"
            />
          </Button>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent wrap={wrap} lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={index >= 5 && index <= 9 ? "highlighted" : "default"}
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}
