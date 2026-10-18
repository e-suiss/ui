import { ListIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Header, HeaderActions, HeaderTitle } from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function HeaderLeadingActions() {
  return (
    <View className="-mx-4 -mt-4">
      <Header>
        <HeaderActions side="leading">
          <Button variant="ghost" size="icon" accessibilityLabel="Menu">
            <Icon as={ListIcon} className="size-5" />
          </Button>
        </HeaderActions>
        <HeaderTitle>Library</HeaderTitle>
        <HeaderActions>
          <Button variant="plain" size="sm">
            <Text className="font-semibold">Done</Text>
          </Button>
        </HeaderActions>
      </Header>
    </View>
  )
}
