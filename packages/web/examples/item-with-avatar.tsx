import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemWithAvatar() {
  return (
    <Item variant="outline" className="w-96">
      <ItemMedia>
        <Avatar size="lg">
          <AvatarImage
            src="https://i.pravatar.cc/96?img=12"
            alt="Olivia Martin"
          />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Olivia Martin</ItemTitle>
        <ItemDescription>Last seen 5 minutes ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm">Message</Button>
      </ItemActions>
    </Item>
  )
}
