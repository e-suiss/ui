import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemDemo() {
  return (
    <Item variant="outline" className="w-96">
      <ItemMedia variant="icon">
        <IconPlaceholder
          lucide="ShieldCheckIcon"
          tabler="IconShieldCheck"
          hugeicons="SecurityCheckIcon"
          phosphor="ShieldCheckIcon"
          remixicon="RiShieldCheckLine"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Two-factor authentication</ItemTitle>
        <ItemDescription>
          Add an extra layer of security to your account.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Enable
        </Button>
      </ItemActions>
    </Item>
  )
}
