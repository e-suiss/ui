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

const sources = [
  { title: "pnpm install | pnpm.io", url: "https://pnpm.io/cli/install" },
  {
    title: "Continuous Integration | pnpm.io",
    url: "https://pnpm.io/continuous-integration",
  },
]

function SourceRow({ title, url }: { title: string; url: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityHint="Opens in the browser"
      onPress={() => Linking.openURL(url)}
      className="self-start active:opacity-70"
    >
      <TraceLine>
        <TraceIcon>
          <Icon as={GlobeIcon} />
        </TraceIcon>
        <TraceTitle>{title}</TraceTitle>
        <TraceIcon>
          <Icon as={ArrowUpRightIcon} />
        </TraceIcon>
      </TraceLine>
    </Pressable>
  )
}

export default function TraceSources() {
  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={GlobeIcon} />
          </TraceIcon>
          <TraceTitle>Used {sources.length} sources</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {sources.map((source) => (
            <SourceRow key={source.url} {...source} />
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
