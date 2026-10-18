import { BrainIcon, FolderOpenIcon, TerminalIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function TraceTurn() {
  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status="error">
          <TraceTitle>Worked for 2m 4s, 1 command failed</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted>
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={BrainIcon} />
            </TraceIcon>
            <TraceTitle>Thought</TraceTitle>
            <TraceDescription>12s</TraceDescription>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <Icon as={TerminalIcon} />
            </TraceIcon>
            <TraceTitle>Ran node --version</TraceTitle>
          </TraceLine>
          <TraceLine status="error">
            <TraceIcon>
              <Icon as={TerminalIcon} />
            </TraceIcon>
            <TraceTitle>Failed to run pnpm --version</TraceTitle>
          </TraceLine>
        </Trace>
        <Text className="my-2 text-foreground">
          Node is installed and pnpm is not. Reading the docs config.
        </Text>
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={FolderOpenIcon} />
            </TraceIcon>
            <TraceTitle>Read apps/web/lib/docs.ts</TraceTitle>
          </TraceLine>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
