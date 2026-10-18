import { CopyIcon, ShareIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupWithSeparator() {
  return (
    <ButtonGroup>
      <Button variant="secondary">
        <Icon as={CopyIcon} />
        <Text>Copy</Text>
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">
        <Icon as={ShareIcon} />
        <Text>Share</Text>
      </Button>
    </ButtonGroup>
  )
}
