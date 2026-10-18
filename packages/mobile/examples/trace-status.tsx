import {
  CheckCircleIcon,
  CircleIcon,
  CircleNotchIcon,
  WarningCircleIcon,
} from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export default function TraceStatus() {
  return (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <Icon as={CheckCircleIcon} />
        </TraceIcon>
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceIcon>
          <Icon as={WarningCircleIcon} />
        </TraceIcon>
        <TraceTitle>Failed to run pnpm lint</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>
          <Icon as={CircleNotchIcon} />
        </TraceIcon>
        <TraceTitle>Running pnpm build</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <Icon as={CircleIcon} />
        </TraceIcon>
        <TraceTitle>Run pnpm test</TraceTitle>
      </TraceLine>
    </Trace>
  )
}
