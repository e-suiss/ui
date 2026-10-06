import { ChatCircleIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

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
    <Item render={<a href={`#topic-${topic.id}`} />}>
      <ItemMedia variant="icon">
        <ChatCircleIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{topic.title}</ItemTitle>
        <ItemDescription>{topic.replies} replies</ItemDescription>
      </ItemContent>
    </Item>
  )
}

const meta = {
  title: "Patterns/Paged List",
  component: PagedList<Topic>,
  parameters: { layout: "padded" },
  args: {
    items: topics,
    pageSize: 10,
    getKey: (topic: Topic) => topic.id,
    renderItem: (topic: Topic) => <TopicRow topic={topic} />,
    className: "mx-auto w-full max-w-2xl",
  },
} satisfies Meta<typeof PagedList<Topic>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const StartOnLaterPage: Story = {
  args: { defaultPage: 4 },
}

export const SinglePage: Story = {
  args: { items: topics.slice(0, 6) },
}

export const PageLinks: Story = {
  args: { getPageHref: (page: number) => `#page-${page}` },
}

export const CustomLabels: Story = {
  args: {
    loadMoreLabel: "Show more topics",
    previousLabel: "Newer",
    nextLabel: "Older",
  },
}

function ControlledExample(
  args: React.ComponentProps<typeof PagedList<Topic>>
) {
  const [page, setPage] = React.useState(2)

  return (
    <div className="flex flex-col gap-2">
      <PagedList {...args} page={page} onPageChange={setPage} />
      <p className="text-center text-sm text-label-secondary">Page {page}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
}
