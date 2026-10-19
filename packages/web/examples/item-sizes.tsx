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
    <div className="flex w-96 flex-col gap-4">
      <Item variant="outline" size="default">
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
      <Item variant="outline" size="sm">
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
      <Item variant="outline" size="xs">
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
    </div>
  )
}
