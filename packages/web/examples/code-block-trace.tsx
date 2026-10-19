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

const output = `$ node --version
v24.18.0`

const error = `$ pnpm dev
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1908:16)`

export default function CodeBlockTrace() {
  return (
    <Trace className="w-full max-w-md">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder
                lucide="TerminalIcon"
                tabler="IconTerminal2"
                hugeicons="ComputerTerminal01Icon"
                phosphor="TerminalWindowIcon"
                remixicon="RiTerminalBoxLine"
              />
            </TraceIcon>
            <TraceTitle>Ran node --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {output}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <IconPlaceholder
                lucide="TerminalIcon"
                tabler="IconTerminal2"
                hugeicons="ComputerTerminal01Icon"
                phosphor="TerminalWindowIcon"
                remixicon="RiTerminalBoxLine"
              />
            </TraceIcon>
            <TraceTitle>Failed to run pnpm dev</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm" variant="destructive">
            <CodeBlockContent wrap className="max-h-64">
              {error}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
