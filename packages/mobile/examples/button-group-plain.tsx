import { ArrowLeftIcon, ArrowRightIcon, ShareIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupPlain() {
  return (
    <ButtonGroup>
      <Button variant="plain">
        <Icon as={ArrowLeftIcon} />
        <Text>Back</Text>
      </Button>
      <Button variant="plain">
        <Text>Forward</Text>
        <Icon as={ArrowRightIcon} />
      </Button>
      <Button variant="plain">
        <Icon as={ShareIcon} />
        <Text>Share</Text>
      </Button>
    </ButtonGroup>
  )
}
