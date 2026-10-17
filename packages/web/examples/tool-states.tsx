import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function ToolStates() {
  return (
    <Trace className="max-w-sm">
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
            <TraceTitle>Ran git status --short</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {" M app/api/chat/route.ts\n M components/chat.tsx"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
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
            <TraceTitle>Failed to run pnpm dev</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              Command timed out after 120 seconds.
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
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
        <TraceTitle>Denied rm -rf dist</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>
          <IconPlaceholder
            lucide="TerminalIcon"
            tabler="IconTerminal"
            hugeicons="ComputerTerminal01Icon"
            phosphor="TerminalIcon"
            remixicon="RiTerminalLine"
          />
        </TraceIcon>
        <TraceTitle>Running pnpm test</TraceTitle>
      </TraceLine>
    </Trace>
  )
}
