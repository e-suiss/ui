import { BellIcon, CaretRightIcon } from "@phosphor-icons/react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemAsLink() {
  return (
    <div className="w-96">
      <Item variant="outline" render={<a href="#notifications" />}>
        <ItemMedia variant="icon">
          <BellIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Notification settings</ItemTitle>
          <ItemDescription>
            Choose what you want to be notified about.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <CaretRightIcon className="size-4" />
        </ItemActions>
      </Item>
    </div>
  )
}
