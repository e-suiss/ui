import { CopyIcon, ShareIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupWithSeparator() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button variant="secondary">
        <CopyIcon data-icon="inline-start" />
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">
        <ShareIcon data-icon="inline-start" />
        Share
      </Button>
    </ButtonGroup>
  )
}
