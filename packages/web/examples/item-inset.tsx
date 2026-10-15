import { PlusIcon } from "@phosphor-icons/react"
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

const people = [
  {
    name: "Olivia Martin",
    email: "olivia@example.com",
    avatar: "https://i.pravatar.cc/96?img=12",
  },
  {
    name: "Liam Chen",
    email: "liam@example.com",
    avatar: "https://github.com/vercel.png",
  },
  {
    name: "Sofia Rossi",
    email: "sofia@example.com",
    avatar: "https://github.com/github.png",
  },
]

export default function ItemInset() {
  return (
    <div className="w-96">
      <ItemGroup variant="inset">
        {people.map((person, index) => (
          <div key={person.email} className="contents">
            {index > 0 && <ItemSeparator />}
            <Item variant="default" size="sm" role="listitem">
              <ItemMedia variant="image">
                <img src={person.avatar} alt={person.name} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{person.name}</ItemTitle>
                <ItemDescription>{person.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon-sm" aria-label="Invite">
                  <PlusIcon />
                </Button>
              </ItemActions>
            </Item>
          </div>
        ))}
      </ItemGroup>
    </div>
  )
}
