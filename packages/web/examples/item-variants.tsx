import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemVariants() {
  return (
    <div className="w-96">
      <div className="flex flex-col gap-4">
        {(["default", "outline", "muted"] as const).map((variant) => (
          <Item key={variant} variant={variant}>
            <ItemContent>
              <ItemTitle>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} item
              </ItemTitle>
              <ItemDescription>
                A short description of this list entry.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  )
}
