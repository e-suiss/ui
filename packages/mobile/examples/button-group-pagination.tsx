import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupPagination() {
  return (
    <ButtonGroup accessibilityLabel="Pagination">
      <Button variant="outline" size="icon" accessibilityLabel="Previous page">
        <Icon as={CaretLeftIcon} />
      </Button>
      <Button variant="outline">
        <Text>1</Text>
      </Button>
      <Button variant="outline" accessibilityState={{ selected: true }}>
        <Text>2</Text>
      </Button>
      <Button variant="outline">
        <Text>3</Text>
      </Button>
      <Button variant="outline" size="icon" accessibilityLabel="Next page">
        <Icon as={CaretRightIcon} />
      </Button>
    </ButtonGroup>
  )
}
