import { ArrowLeftIcon, ArrowRightIcon, ShareIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupPlain() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button variant="plain">
        <ArrowLeftIcon data-icon="inline-start" />
        Back
      </Button>
      <Button variant="plain">
        Forward
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="plain">
        <ShareIcon data-icon="inline-start" />
        Share
      </Button>
    </ButtonGroup>
  )
}
