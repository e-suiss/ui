import { Screen, ScreenContent } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

export default function ScreenTopEdgeOnly() {
  return (
    <Screen edges={["top"]} className="-m-4">
      <ScreenContent className="bg-muted">
        <Text variant="h3">Top edge only</Text>
        <Text variant="muted">
          The bottom, left and right edges are not padded.
        </Text>
      </ScreenContent>
    </Screen>
  )
}
