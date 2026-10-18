import { TerminalIcon } from "phosphor-react-native"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import {
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

export default function TraceCollapsibleExample() {
  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={TerminalIcon} />
          </TraceIcon>
          <TraceTitle>Ran node --version</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Output>{"$ node --version\nv24.18.0"}</Output>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
