import { GitBranchIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export default function TraceStatic() {
  return (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <Icon as={GitBranchIcon} />
        </TraceIcon>
        <TraceTitle>Created branch fix/frozen-lockfile</TraceTitle>
      </TraceLine>
    </Trace>
  )
}
