import * as React from "react"
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

export default function PagedListControlled() {
  const [page, setPage] = React.useState(2)

  return (
    <div className="flex flex-col gap-2">
      <PagedList<Topic>
        items={topics}
        pageSize={10}
        getKey={(topic: Topic) => topic.id}
        renderItem={(topic: Topic) => (
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
        )}
        className="mx-auto w-full max-w-2xl"
        page={page}
        onPageChange={setPage}
      />
      <p className="text-center text-sm text-muted-foreground">Page {page}</p>
    </div>
  )
}
