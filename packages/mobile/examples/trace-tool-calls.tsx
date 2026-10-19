import { FileTextIcon, WarningCircleIcon } from "phosphor-react-native"
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

export default function TraceToolCalls() {
  return (
    <Trace>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Icon as={FileTextIcon} />
            </TraceIcon>
            <TraceTitle>Read package.json</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap>
              {'{ "name": "acme", "packageManager": "pnpm@10.18.0" }'}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <Icon as={WarningCircleIcon} />
            </TraceIcon>
            <TraceTitle>Failed to run pnpm install</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm" variant="destructive">
            <CodeBlockContent wrap>
              ERR_PNPM_OUTDATED_LOCKFILE pnpm-lock.yaml is out of date
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
