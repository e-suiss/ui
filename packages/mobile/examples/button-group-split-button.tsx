import { CaretDownIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupSplitButton() {
  return (
    <ButtonGroup>
      <Button>
        <Text>Publish</Text>
      </Button>
      <ButtonGroupSeparator className="bg-primary-foreground/30" />
      <Button size="icon" accessibilityLabel="More options">
        <Icon as={CaretDownIcon} />
      </Button>
    </ButtonGroup>
  )
}
