import { ArrowUpRightIcon, GlobeIcon } from "phosphor-react-native"
import { Linking, Pressable } from "react-native"
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

export default function TraceSources() {
  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={GlobeIcon} />
          </TraceIcon>
          <TraceTitle>Used 2 sources</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          <Pressable
            accessibilityRole="link"
            accessibilityHint="Opens in the browser"
            onPress={() => Linking.openURL("https://pnpm.io/cli/install")}
            className="self-start active:opacity-70"
          >
            <TraceLine>
              <TraceIcon>
                <Icon as={GlobeIcon} />
              </TraceIcon>
              <TraceTitle>pnpm install | pnpm.io</TraceTitle>
              <TraceIcon>
                <Icon as={ArrowUpRightIcon} />
              </TraceIcon>
            </TraceLine>
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityHint="Opens in the browser"
            onPress={() =>
              Linking.openURL("https://pnpm.io/continuous-integration")
            }
            className="self-start active:opacity-70"
          >
            <TraceLine>
              <TraceIcon>
                <Icon as={GlobeIcon} />
              </TraceIcon>
              <TraceTitle>Continuous Integration | pnpm.io</TraceTitle>
              <TraceIcon>
                <Icon as={ArrowUpRightIcon} />
              </TraceIcon>
            </TraceLine>
          </Pressable>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
