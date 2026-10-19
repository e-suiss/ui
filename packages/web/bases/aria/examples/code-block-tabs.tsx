"use client"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"

const routeCode = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}`

const chatCode = `"use client"

import { useChat } from "@ai-sdk/react"

export function Chat() {
  const { messages } = useChat()

  return <MessageList messages={messages} />
}`

const envCode = "AI_GATEWAY_API_KEY=your-api-key"

function FileCode({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent lineNumbers>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

export default function CodeBlockTabs() {
  return (
    <Tabs defaultSelectedKey="route" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger id="route">route.ts</TabsTrigger>
        <TabsTrigger id="chat">chat.tsx</TabsTrigger>
        <TabsTrigger id="env">.env.local</TabsTrigger>
      </TabsList>
      <TabsContent id="route">
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={routeCode} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <FileCode code={routeCode} language="ts" />
        </CodeBlock>
      </TabsContent>
      <TabsContent id="chat">
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>components/chat.tsx</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={chatCode} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <FileCode code={chatCode} language="tsx" />
        </CodeBlock>
      </TabsContent>
      <TabsContent id="env">
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>.env.local</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={envCode} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <FileCode code={envCode} language="bash" />
        </CodeBlock>
      </TabsContent>
    </Tabs>
  )
}
