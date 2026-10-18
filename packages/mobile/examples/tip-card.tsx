import { PushPinIcon } from "phosphor-react-native"
import * as React from "react"
import {
  resetTips,
  Tip,
  TipCard,
  TipClose,
  TipContent,
  TipDescription,
  TipIcon,
  TipTitle,
} from "@/components/interactions/tip"
import { Icon } from "@/components/ui/icon"

function CardExample() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    resetTips(["story-card"]).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <Tip id="story-card">
      <TipCard>
        <TipIcon>
          <Icon as={PushPinIcon} weight="duotone" />
        </TipIcon>
        <TipContent>
          <TipTitle>Pin your favorites</TipTitle>
          <TipDescription>
            Swipe right on a note to keep it at the top of the list.
          </TipDescription>
        </TipContent>
        <TipClose />
      </TipCard>
    </Tip>
  )
}

export default function TipCardExample() {
  return <CardExample />
}
