import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const LINT_OUTPUT = `> acme-chat@0.1.0 lint
> eslint .`

const TEST_OUTPUT = `> acme-chat@0.1.0 test
> vitest run

 ✓ lib/ai.test.ts (6 tests) 41ms
 ✓ components/chat.test.tsx (9 tests) 212ms

 Test Files  2 passed (2)
      Tests  15 passed (15)`

const BUILD_OUTPUT = `> acme-chat@0.1.0 build
> next build

   ▲ Next.js 16.3.0
   Creating an optimized production build ...
 ✓ Compiled successfully in 4.2s
 ✓ Generating static pages (12/12)

Route (app)                Size  First Load JS
┌ ○ /                     1.9 kB       112 kB
└ ƒ /api/chat              141 B       102 kB`

export default function TerminalDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>Run the checks, then build the app.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="TerminalIcon"
                      tabler="IconTerminal"
                      hugeicons="ComputerTerminal01Icon"
                      phosphor="TerminalIcon"
                      remixicon="RiTerminalLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Ran pnpm lint</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    {LINT_OUTPUT}
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="TerminalIcon"
                      tabler="IconTerminal"
                      hugeicons="ComputerTerminal01Icon"
                      phosphor="TerminalIcon"
                      remixicon="RiTerminalLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Ran pnpm test</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    {TEST_OUTPUT}
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="TerminalIcon"
                      tabler="IconTerminal"
                      hugeicons="ComputerTerminal01Icon"
                      phosphor="TerminalIcon"
                      remixicon="RiTerminalLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Ran pnpm build</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    {BUILD_OUTPUT}
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p>Lint and tests pass, and the build compiled both routes.</p>
        </MessageContent>
      </Message>
    </div>
  )
}
