import { MagnifyingGlassIcon, PlusIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderActions,
  HeaderBack,
  HeaderTitle,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"

export default function HeaderSubtitle() {
  return (
    <Header className="-mx-4 -mt-4">
      <HeaderBack />
      <HeaderTitle subtitle="Last seen today">Alex Morgan</HeaderTitle>
      <HeaderActions>
        <Button variant="ghost" size="icon" accessibilityLabel="Search">
          <Icon as={MagnifyingGlassIcon} className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" accessibilityLabel="New message">
          <Icon as={PlusIcon} className="size-5" />
        </Button>
      </HeaderActions>
    </Header>
  )
}
