import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
              <IconPlaceholder
                lucide="CircleCheckIcon"
                tabler="IconCircleCheck"
                hugeicons="CheckmarkCircle02Icon"
                phosphor="CheckCircleIcon"
                remixicon="RiCheckboxCircleLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Your profile has been verified</ItemTitle>
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
        ))}
      </div>
    </div>
  )
}
