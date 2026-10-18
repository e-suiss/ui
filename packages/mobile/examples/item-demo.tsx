import { CaretRightIcon, ShieldCheckIcon } from "phosphor-react-native"
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
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Text } from "@/components/ui/text"

export default function ItemDemo() {
  return (
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
  )
}
