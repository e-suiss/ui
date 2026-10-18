import { PlusIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupSizes() {
  return (
    <View className="items-start gap-6">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          <Text>Small</Text>
        </Button>
        <Button variant="outline" size="sm">
          <Text>Button</Text>
        </Button>
        <Button variant="outline" size="sm">
          <Text>Group</Text>
        </Button>
        <Button variant="outline" size="icon-sm" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">
          <Text>Default</Text>
        </Button>
        <Button variant="outline">
          <Text>Button</Text>
        </Button>
        <Button variant="outline">
          <Text>Group</Text>
        </Button>
        <Button variant="outline" size="icon" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="lg">
          <Text>Large</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>Button</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>Group</Text>
        </Button>
        <Button variant="outline" size="icon-lg" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </ButtonGroup>
    </View>
  )
}
