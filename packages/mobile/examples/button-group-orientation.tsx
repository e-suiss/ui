import { MinusIcon, PlusIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"

export default function ButtonGroupOrientation() {
  return (
    <ButtonGroup orientation="vertical" accessibilityLabel="Media controls">
      <Button variant="secondary" size="icon" accessibilityLabel="Zoom in">
        <Icon as={PlusIcon} />
      </Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="secondary" size="icon" accessibilityLabel="Zoom out">
        <Icon as={MinusIcon} />
      </Button>
    </ButtonGroup>
  )
}
