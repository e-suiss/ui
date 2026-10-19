import { ArrowUpRightIcon, GlobeIcon } from "phosphor-react-native"
import { Linking, Pressable } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export default function TraceLink() {
  return (
    <Trace>
      <Pressable
        accessibilityRole="link"
        accessibilityHint="Opens in the browser"
        onPress={() =>
          Linking.openURL("https://docs.astro.build/en/install-and-setup/")
        }
        className="self-start active:opacity-70"
      >
        <TraceLine>
          <TraceIcon>
            <Icon as={GlobeIcon} />
          </TraceIcon>
          <TraceTitle>Install Astro | docs.astro.build</TraceTitle>
          <TraceIcon>
            <Icon as={ArrowUpRightIcon} />
          </TraceIcon>
        </TraceLine>
      </Pressable>
    </Trace>
  )
}
