import { BrainIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function TraceReasoning() {
  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={BrainIcon} />
          </TraceIcon>
          <TraceTitle>Thought</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Text>
          The build log shows install and compile finish in under a minute.
          Image optimization takes almost four, and it reruns on every deploy
          because the cache key includes the commit hash.
        </Text>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
