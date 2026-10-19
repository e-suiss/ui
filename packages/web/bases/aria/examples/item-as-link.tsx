import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
    <Item
      variant="outline"
      className="w-96"
      render={(props) => <a href="#notifications" {...props} />}
    >
      <ItemMedia variant="icon">
        <IconPlaceholder
          lucide="BellIcon"
          tabler="IconBell"
          hugeicons="Notification03Icon"
          phosphor="BellIcon"
          remixicon="RiNotificationLine"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Notification settings</ItemTitle>
        <ItemDescription>
          Choose what you want to be notified about.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
          className="size-4"
        />
      </ItemActions>
    </Item>
  )
}
