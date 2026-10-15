import { CaretRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemSizes() {
  return (
    <div className="w-96">
      <div className="flex flex-col gap-4">
        {(["default", "sm", "xs"] as const).map((size) => (
          <Item key={size} variant="outline" size={size}>
            <ItemMedia variant="icon">
              <CheckCircleIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Your profile has been verified</ItemTitle>
            </ItemContent>
            <ItemActions>
              <CaretRightIcon className="size-4" />
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  )
}
