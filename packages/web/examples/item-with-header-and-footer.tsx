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
    <div className="w-96">
      <Item variant="outline">
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
          <span className="text-label-secondary text-xs">Renews on May 1</span>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </ItemFooter>
      </Item>
    </div>
  )
}
