import { MagnifyingGlassIcon, PlusIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderActions,
  HeaderBack,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const messages = [
  "Lunch on Friday?",
  "The draft is ready for review",
  "Photos from the trip",
  "Invoice for September",
  "Your order has shipped",
  "Team sync moved to 3 PM",
  "Weekend plans",
  "Book club picks",
  "Flight confirmation",
  "New comment on your post",
  "Reminder: dentist at 10",
  "Quarterly report",
  "Welcome to the beta",
  "Parking update",
  "Recipe you asked for",
]

export default function HeaderLargeTitleExample() {
  const scroll = useHeaderScroll()
  return (
    <View className="-m-4 flex-1">
      <Header scroll={scroll}>
        <HeaderBack>Mailboxes</HeaderBack>
        <HeaderTitle>Inbox</HeaderTitle>
        <HeaderActions>
          <Button variant="ghost" size="icon" accessibilityLabel="Search">
            <Icon as={MagnifyingGlassIcon} className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" accessibilityLabel="New message">
            <Icon as={PlusIcon} className="size-5" />
          </Button>
        </HeaderActions>
      </Header>
      <HeaderScrollView scroll={scroll}>
        <HeaderLargeTitle>Inbox</HeaderLargeTitle>
        <View className="px-4">
          {messages.map((message, index) => (
            <View
              key={message}
              className={index > 0 ? "border-t border-border py-3" : "py-3"}
            >
              <Text numberOfLines={1}>{message}</Text>
            </View>
          ))}
        </View>
      </HeaderScrollView>
    </View>
  )
}
