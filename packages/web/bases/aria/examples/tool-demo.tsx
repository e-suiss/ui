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

export default function ToolDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>Which package managers are installed?</BubbleContent>
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
                  <TraceTitle>Ran node --version</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    v24.18.0
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
                  <TraceTitle>Ran npm --version</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    11.6.2
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultExpanded>
              <TraceCollapsibleTrigger>
                <TraceLine status="error">
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="TerminalIcon"
                      tabler="IconTerminal"
                      hugeicons="ComputerTerminal01Icon"
                      phosphor="TerminalIcon"
                      remixicon="RiTerminalLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Failed to run pnpm --version</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    command not found: pnpm
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p>Node 24 and npm 11 are installed. pnpm is not.</p>
        </MessageContent>
      </Message>
    </div>
  )
}
