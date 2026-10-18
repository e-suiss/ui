import { FileTextIcon, MagnifyingGlassIcon } from "phosphor-react-native"
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

export default function TraceSteps() {
  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status="running">
          <TraceTitle>Looking into the slow deploy</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted>
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={MagnifyingGlassIcon} />
            </TraceIcon>
            <TraceTitle>Searched for the checkout build log</TraceTitle>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <Icon as={FileTextIcon} />
            </TraceIcon>
            <TraceTitle>Read the last twelve deploys</TraceTitle>
          </TraceLine>
          <TraceLine status="running">
            <TraceIcon>
              <Icon as={MagnifyingGlassIcon} />
            </TraceIcon>
            <TraceTitle>Searching for the cache key</TraceTitle>
          </TraceLine>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
