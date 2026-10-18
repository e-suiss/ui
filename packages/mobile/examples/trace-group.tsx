import {
  FileTextIcon,
  MagnifyingGlassIcon,
  TerminalIcon,
} from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export default function TraceGroup() {
  return (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <Icon as={MagnifyingGlassIcon} />
        </TraceIcon>
        <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <Icon as={FileTextIcon} />
        </TraceIcon>
        <TraceTitle>Read pnpm-workspace.yaml</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <Icon as={TerminalIcon} />
        </TraceIcon>
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
    </Trace>
  )
}
