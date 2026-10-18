import { ArrowLeftIcon, ArrowRightIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupNested() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        {["1", "2", "3", "4", "5"].map((page) => (
          <Button key={page} variant="outline" size="sm">
            <Text>{page}</Text>
          </Button>
        ))}
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
