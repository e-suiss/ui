import type { Meta, StoryObj } from "@storybook/react-native"
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

function TopicRow({ topic }: { topic: Topic }) {
  return (
    <Item onPress={() => {}}>
      <ItemMedia variant="icon">
        <Icon as={ChatCircleIcon} />
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
  args: {
    items: topics,
    pageSize: 10,
    getKey: (topic: Topic) => topic.id,
    renderItem: (topic: Topic) => <TopicRow topic={topic} />,
  },
} satisfies Meta<typeof PagedList<Topic>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmallPages: Story = {
  args: { pageSize: 3 },
}

export const SinglePage: Story = {
  args: { items: topics.slice(0, 6) },
}

export const CustomLabels: Story = {
  args: { pageSize: 3, loadMoreLabel: "Show more topics" },
}
