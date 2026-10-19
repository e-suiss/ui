import { ArrowLeftIcon, ArrowRightIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupNested() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          <Text>1</Text>
        </Button>
        <Button variant="outline" size="sm">
          <Text>2</Text>
        </Button>
        <Button variant="outline" size="sm">
          <Text>3</Text>
        </Button>
        <Button variant="outline" size="sm">
          <Text>4</Text>
        </Button>
        <Button variant="outline" size="sm">
          <Text>5</Text>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" accessibilityLabel="Previous">
          <Icon as={ArrowLeftIcon} />
        </Button>
        <Button variant="outline" size="icon-sm" accessibilityLabel="Next">
          <Icon as={ArrowRightIcon} />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
