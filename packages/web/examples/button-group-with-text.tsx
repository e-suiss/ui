import { LinkIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"

export default function ButtonGroupWithText() {
  return (
    <ButtonGroup orientation="horizontal">
      <ButtonGroupText>
        <LinkIcon />
        https://
      </ButtonGroupText>
      <Input aria-label="Website" placeholder="example.com" />
      <Button variant="secondary" size="lg">
        Save
      </Button>
    </ButtonGroup>
  )
}
