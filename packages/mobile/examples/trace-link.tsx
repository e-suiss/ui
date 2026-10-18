import { ArrowUpRightIcon, GlobeIcon } from "phosphor-react-native"
import { Linking, Pressable } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

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

export default function TraceLink() {
  return (
    <Trace>
      <SourceRow
        title="Install Astro | docs.astro.build"
        url="https://docs.astro.build/en/install-and-setup/"
      />
    </Trace>
  )
}
