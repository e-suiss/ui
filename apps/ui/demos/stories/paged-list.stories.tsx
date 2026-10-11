// @ts-nocheck
import { ChatCircleIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

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

export const Default: Story = {
  play: async ({ canvas, step }) => {
    await step("shows the first page of items", async () => {
      await expect(canvas.getByText("Getting started · thread 1")).toBeVisible()
      await expect(
        canvas.queryByText("Dark mode tokens · thread 34")
      ).toBeNull()
      await expect(
        canvas.getByRole("link", { name: "Go to previous page" })
      ).toHaveAttribute("aria-disabled", "true")
    })

    await step("moves to a page from its number", async () => {
      await userEvent.click(canvas.getByRole("link", { name: "2" }))
      await expect(
        await canvas.findByText("Release notes · thread 12")
      ).toBeVisible()
      await expect(canvas.getByRole("link", { name: "2" })).toHaveAttribute(
        "aria-current",
        "page"
      )
      await expect(canvas.queryByText("Getting started · thread 1")).toBeNull()
    })

    await step("steps forward and back with next and previous", async () => {
      await userEvent.click(
        canvas.getByRole("link", { name: "Go to next page" })
      )
      await expect(
        await canvas.findByText("Getting started · thread 25")
      ).toBeVisible()
      await userEvent.click(
        canvas.getByRole("link", { name: "Go to previous page" })
      )
      await expect(
        await canvas.findByText("Release notes · thread 12")
      ).toBeVisible()
    })

    await step("disables next on the last page", async () => {
      await userEvent.click(canvas.getByRole("link", { name: "6" }))
      await expect(
        await canvas.findByText("Getting started · thread 57")
      ).toBeVisible()
      await expect(
        canvas.getByRole("link", { name: "Go to next page" })
      ).toHaveAttribute("aria-disabled", "true")
    })
  },
}

export const StartOnLaterPage: Story = {
  args: { defaultPage: 4 },
  play: async ({ canvas, step }) => {
    await step("opens on the given page", async () => {
      await expect(canvas.getByRole("link", { name: "4" })).toHaveAttribute(
        "aria-current",
        "page"
      )
      await expect(canvas.getByText("Release notes · thread 36")).toBeVisible()
      await expect(canvas.queryByText("Getting started · thread 1")).toBeNull()
    })
  },
}

export const SinglePage: Story = {
  args: { items: topics.slice(0, 6) },
  play: async ({ canvas, step }) => {
    await step("lists every item without pagination", async () => {
      await expect(canvas.getByText("Theming · thread 6")).toBeVisible()
      await expect(canvas.queryByRole("navigation")).toBeNull()
    })
  },
}

export const PageLinks: Story = {
  args: { getPageHref: (page: number) => `#page-${page}` },
  play: async ({ canvas, step }) => {
    await step("renders real page links", async () => {
      const second = canvas.getByRole("link", { name: "2" })
      await expect(second).toHaveAttribute("href", "#page-2")
      await expect(
        canvas.getByRole("link", { name: "Go to next page" })
      ).toHaveAttribute("href", "#page-2")
      await expect(
        canvas.getByRole("link", { name: "Go to previous page" })
      ).toHaveAttribute("href", "#page-0")
    })
  },
}

export const CustomLabels: Story = {
  args: {
    loadMoreLabel: "Show more topics",
    previousLabel: "Newer",
    nextLabel: "Older",
  },
  play: async ({ canvas, step }) => {
    await step("shows the custom labels and pages with them", async () => {
      await expect(canvas.getByText("Newer")).toBeVisible()
      await userEvent.click(canvas.getByText("Older"))
      await expect(
        await canvas.findByText("Release notes · thread 12")
      ).toBeVisible()
    })
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
  play: async ({ canvas, step }) => {
    await step("starts on the controlled page", async () => {
      await expect(canvas.getByText("Page 2")).toBeVisible()
      await expect(canvas.getByText("Release notes · thread 12")).toBeVisible()
    })

    await step("reports page changes to the owner", async () => {
      await userEvent.click(canvas.getByRole("link", { name: "3" }))
      await waitFor(() => expect(canvas.getByText("Page 3")).toBeVisible())
      await expect(
        canvas.getByText("Getting started · thread 25")
      ).toBeVisible()
    })
  },
}
