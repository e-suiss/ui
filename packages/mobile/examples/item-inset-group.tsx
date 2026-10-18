import { BellIcon, CaretRightIcon, WifiHighIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Text } from "@/components/ui/text"

export default function ItemInsetGroup() {
  return (
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
  )
}
