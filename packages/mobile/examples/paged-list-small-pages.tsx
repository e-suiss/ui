import { ChatCircleIcon } from "phosphor-react-native"
import { PagedList } from "@/components/patterns/paged-list"
import { Icon } from "@/components/ui/icon"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

type Topic = { id: number; title: string; replies: number }

const subjects = [
  "Getting started",
  "Dark mode tokens",
  "Form validation",
  "Release notes",
  "Accessibility",
  "Theming",
  "Server components",
  "Animations",
]

const topics: Topic[] = Array.from({ length: 57 }, (_, index) => ({
  id: index + 1,
  title: `${subjects[index % subjects.length]} · thread ${index + 1}`,
  replies: (index * 7) % 23,
}))

export default function PagedListSmallPages() {
  return (
    <PagedList<Topic>
      items={topics}
      pageSize={3}
      getKey={(topic: Topic) => topic.id}
      renderItem={(topic: Topic) => (
        <Item onPress={() => undefined}>
          <ItemMedia variant="icon">
            <Icon as={ChatCircleIcon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{topic.title}</ItemTitle>
            <ItemDescription>{topic.replies} replies</ItemDescription>
          </ItemContent>
        </Item>
      )}
    />
  )
}
