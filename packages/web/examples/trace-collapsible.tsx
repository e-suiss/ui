import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function TraceCollapsibleDemo() {
  return (
    <TraceCollapsible className="w-full max-w-sm">
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
            {"$ node --version\nv24.18.0"}
          </CodeBlockContent>
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
