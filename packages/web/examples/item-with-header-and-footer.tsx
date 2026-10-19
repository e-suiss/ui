import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemWithHeaderAndFooter() {
  return (
    <Item variant="outline" className="w-96">
      <ItemHeader>
        <ItemTitle>Pro plan</ItemTitle>
        <span className="text-sm font-medium">$24/mo</span>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          Unlimited projects, priority support, and advanced analytics.
        </ItemDescription>
      </ItemContent>
      <ItemFooter>
        <span className="text-muted-foreground text-xs">Renews on May 1</span>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </ItemFooter>
    </Item>
  )
}
