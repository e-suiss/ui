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

const LINT_OUTPUT = `> acme-chat@0.1.0 lint
> eslint .

app/api/chat/route.ts
  14:7  error  'model' is assigned a value but never used  no-unused-vars

components/chat.tsx
  42:5  error  React Hook useEffect has a missing dependency: 'messages'  react-hooks/exhaustive-deps

✖ 2 problems (2 errors, 0 warnings)

 ELIFECYCLE  Command failed with exit code 1.`

export default function TerminalError() {
  return (
    <Trace className="max-w-sm">
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
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
      <TraceCollapsible defaultOpen>
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
            <TraceTitle>pnpm lint exited with code 1</TraceTitle>
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
    </Trace>
  )
}
