import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemWithImage() {
  return (
    <ItemGroup className="w-96">
      <Item variant="default" size="sm" role="listitem">
        <ItemMedia variant="image">
          <img src="https://i.pravatar.cc/96?img=12" alt="Olivia Martin" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Olivia Martin</ItemTitle>
          <ItemDescription>olivia@example.com</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm" aria-label="Invite">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item variant="default" size="sm" role="listitem">
        <ItemMedia variant="image">
          <img src="https://github.com/vercel.png" alt="Liam Chen" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Liam Chen</ItemTitle>
          <ItemDescription>liam@example.com</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm" aria-label="Invite">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item variant="default" size="sm" role="listitem">
        <ItemMedia variant="image">
          <img src="https://github.com/github.png" alt="Sofia Rossi" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sofia Rossi</ItemTitle>
          <ItemDescription>sofia@example.com</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm" aria-label="Invite">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
