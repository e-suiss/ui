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

const calls = [
  { command: "node --version", output: "v24.18.0" },
  { command: "npm --version", output: "11.6.2" },
  { command: "pnpm --version", error: "command not found: pnpm" },
]

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
            {calls.map((call) => (
              <TraceCollapsible
                key={call.command}
                defaultOpen={Boolean(call.error)}
              >
                <TraceCollapsibleTrigger>
                  <TraceLine status={call.error ? "error" : undefined}>
                    <TraceIcon>
                      <IconPlaceholder
                        lucide="TerminalIcon"
                        tabler="IconTerminal"
                        hugeicons="ComputerTerminal01Icon"
                        phosphor="TerminalIcon"
                        remixicon="RiTerminalLine"
                      />
                    </TraceIcon>
                    <TraceTitle>
                      {call.error ? "Failed to run" : "Ran"} {call.command}
                    </TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <CodeBlock size="sm">
                    <CodeBlockContent wrap className="max-h-64">
                      {call.error ?? call.output}
                    </CodeBlockContent>
                  </CodeBlock>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            ))}
          </Trace>
          <p>Node 24 and npm 11 are installed. pnpm is not.</p>
        </MessageContent>
      </Message>
    </div>
  )
}
