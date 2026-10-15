import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { PagedList } from "@/components/patterns/paged-list"
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

function TopicRow({ topic }: { topic: Topic }) {
  return (
    <Item asChild>
      <a href={`#topic-${topic.id}`}>
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="MessageCircleIcon"
            tabler="IconMessageCircle"
            hugeicons="BubbleChatIcon"
            phosphor="ChatCircleIcon"
            remixicon="RiChat1Line"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{topic.title}</ItemTitle>
          <ItemDescription>{topic.replies} replies</ItemDescription>
        </ItemContent>
      </a>
    </Item>
  )
}

export default function PagedListCustomLabels() {
  return (
    <PagedList<Topic>
      items={topics}
      pageSize={10}
      getKey={(topic: Topic) => topic.id}
      renderItem={(topic: Topic) => <TopicRow topic={topic} />}
      className="mx-auto w-full max-w-2xl"
      loadMoreLabel="Show more topics"
      previousLabel="Newer"
      nextLabel="Older"
    />
  )
}
