import { MagnifyingGlassIcon, PlusIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderActions,
  HeaderBack,
  HeaderTitle,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"

function TrailingActions() {
  return (
    <HeaderActions>
      <Button variant="ghost" size="icon" accessibilityLabel="Search">
        <Icon as={MagnifyingGlassIcon} className="size-5" />
      </Button>
      <Button variant="ghost" size="icon" accessibilityLabel="New message">
        <Icon as={PlusIcon} className="size-5" />
      </Button>
    </HeaderActions>
  )
}

export default function HeaderSubtitle() {
  return (
    <View className="-mx-4 -mt-4">
      <Header>
        <HeaderBack />
        <HeaderTitle subtitle="Last seen today">Alex Morgan</HeaderTitle>
        <TrailingActions />
      </Header>
    </View>
  )
}
