import type { Meta, StoryObj } from "@storybook/react-native"
import {
  BellIcon,
  CaretRightIcon,
  ShieldCheckIcon,
  WifiHighIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Item",
  component: Item,
} satisfies Meta<typeof Item>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="gap-4">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Basic item</ItemTitle>
          <ItemDescription>
            A simple item with a title and a description.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            <Text>Action</Text>
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm" onPress={() => undefined}>
        <ItemMedia variant="icon">
          <Icon as={ShieldCheckIcon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your profile has been verified.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Icon as={CaretRightIcon} className="size-4 text-muted-foreground" />
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemHeader>
          <ItemTitle>Header</ItemTitle>
          <Badge>
            <Text>New</Text>
          </Badge>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>
            Items can carry a header and a footer.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <Text className="text-sm text-muted-foreground">Footer</Text>
        </ItemFooter>
      </Item>
    </View>
  ),
}

export const InsetGroup: Story = {
  render: () => (
    <ItemGroup variant="inset">
      <Item onPress={() => undefined}>
        <ItemMedia
          variant="image"
          className="bg-blue-500 items-center justify-center"
        >
          <Icon as={WifiHighIcon} className="size-5 text-primary-foreground" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Wi-Fi</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Text>Home</Text>
          <Icon as={CaretRightIcon} className="size-4 text-muted-foreground" />
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item onPress={() => undefined}>
        <ItemMedia
          variant="image"
          className="bg-red-500 items-center justify-center"
        >
          <Icon as={BellIcon} className="size-5 text-primary-foreground" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Notifications</ItemTitle>
          <ItemDescription>Banners, sounds, badges</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Icon as={CaretRightIcon} className="size-4 text-muted-foreground" />
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
}
