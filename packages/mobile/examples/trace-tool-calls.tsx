import {
  FileTextIcon,
  TerminalIcon,
  WarningCircleIcon,
} from "phosphor-react-native"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

function Output({ children, error }: { children: string; error?: boolean }) {
  return (
    <CodeBlock size="sm" variant={error ? "destructive" : "default"}>
      <CodeBlockContent wrap>{children}</CodeBlockContent>
    </CodeBlock>
  )
}

const calls = [
  {
    title: "Read package.json",
    icon: FileTextIcon,
    output: '{ "name": "acme", "packageManager": "pnpm@10.18.0" }',
  },
  {
    title: "Failed to run pnpm install",
    icon: TerminalIcon,
    error: "ERR_PNPM_OUTDATED_LOCKFILE pnpm-lock.yaml is out of date",
  },
]

export default function TraceToolCalls() {
  return (
    <Trace>
      {calls.map((call) => (
        <TraceCollapsible key={call.title}>
          <TraceCollapsibleTrigger>
            <TraceLine status={call.error ? "error" : undefined}>
              <TraceIcon>
                <Icon as={call.error ? WarningCircleIcon : call.icon} />
              </TraceIcon>
              <TraceTitle>{call.title}</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Output error={Boolean(call.error)}>
              {call.error ?? call.output ?? ""}
            </Output>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      ))}
    </Trace>
  )
}
