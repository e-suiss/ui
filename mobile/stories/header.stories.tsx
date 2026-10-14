import type { Meta, StoryObj } from "@storybook/react-native"
import {
  DotsThreeIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "phosphor-react-native"
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

function MessageRows() {
  return (
    <View className="px-4">
      {messages.map((message, index) => (
        <View
          key={message}
          className={index > 0 ? "border-t border-separator py-3" : "py-3"}
        >
          <Text numberOfLines={1}>{message}</Text>
        </View>
      ))}
    </View>
  )
}

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

function LargeTitleDemo({ subtitle }: { subtitle?: string }) {
  const scroll = useHeaderScroll()
  return (
    <View className="-m-4 flex-1">
      <Header scroll={scroll}>
        <HeaderBack>Mailboxes</HeaderBack>
        <HeaderTitle>Inbox</HeaderTitle>
        <TrailingActions />
      </Header>
      <HeaderScrollView scroll={scroll}>
        <HeaderLargeTitle subtitle={subtitle}>Inbox</HeaderLargeTitle>
        <MessageRows />
      </HeaderScrollView>
    </View>
  )
}

function CompactScrollDemo() {
  const scroll = useHeaderScroll()
  return (
    <View className="-m-4 flex-1">
      <Header scroll={scroll}>
        <HeaderBack />
        <HeaderTitle subtitle="15 messages">Inbox</HeaderTitle>
        <HeaderActions>
          <Button variant="ghost" size="icon" accessibilityLabel="More">
            <Icon as={DotsThreeIcon} weight="bold" className="size-5" />
          </Button>
        </HeaderActions>
      </Header>
      <HeaderScrollView scroll={scroll}>
        <MessageRows />
      </HeaderScrollView>
    </View>
  )
}

const meta = {
  title: "Components/Header",
  component: Header,
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="-mx-4 -mt-4">
      <Header>
        <HeaderBack>Settings</HeaderBack>
        <HeaderTitle>Profile</HeaderTitle>
        <HeaderActions>
          <Button variant="plain" size="sm">
            <Text className="font-semibold">Edit</Text>
          </Button>
        </HeaderActions>
      </Header>
    </View>
  ),
}

export const LargeTitle: Story = {
  render: () => <LargeTitleDemo />,
}

export const LargeTitleWithSubtitle: Story = {
  render: () => <LargeTitleDemo subtitle="3 unread" />,
}

export const CompactWithScroll: Story = {
  render: () => <CompactScrollDemo />,
}

export const Subtitle: Story = {
  render: () => (
    <View className="-mx-4 -mt-4">
      <Header>
        <HeaderBack />
        <HeaderTitle subtitle="Last seen today">Alex Morgan</HeaderTitle>
        <TrailingActions />
      </Header>
    </View>
  ),
}

export const LeadingActions: Story = {
  render: () => (
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
  ),
}

export const BackOnly: Story = {
  render: () => (
    <View className="-mx-4 -mt-4">
      <Header>
        <HeaderBack>A very long previous screen title</HeaderBack>
        <HeaderTitle>Details</HeaderTitle>
      </Header>
    </View>
  ),
}
