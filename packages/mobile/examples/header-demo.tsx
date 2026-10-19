import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderActions,
  HeaderBack,
  HeaderTitle,
} from "@/components/ui/header"
import { Text } from "@/components/ui/text"

export default function HeaderDemo() {
  return (
    <Header className="-mx-4 -mt-4">
      <HeaderBack>Settings</HeaderBack>
      <HeaderTitle>Profile</HeaderTitle>
      <HeaderActions>
        <Button variant="plain" size="sm">
          <Text className="font-semibold">Edit</Text>
        </Button>
      </HeaderActions>
    </Header>
  )
}
