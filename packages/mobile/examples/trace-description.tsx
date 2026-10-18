import {
  MagnifyingGlassIcon,
  NotePencilIcon,
  TerminalIcon,
} from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function TraceDescriptionExample() {
  return (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <Icon as={NotePencilIcon} />
        </TraceIcon>
        <TraceTitle>Edited settings/notifications.tsx</TraceTitle>
        <TraceDescription>+48 −12</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <Icon as={TerminalIcon} />
        </TraceIcon>
        <TraceTitle>Ran pnpm test</TraceTitle>
        <TraceDescription>14s</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <Icon as={MagnifyingGlassIcon} />
        </TraceIcon>
        <TraceTitle>Searched for useChat</TraceTitle>
        <TraceDescription>8 results</TraceDescription>
      </TraceLine>
    </Trace>
  )
}
