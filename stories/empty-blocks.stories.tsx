import type { Meta, StoryObj } from "@storybook/react-vite"

import { EmptyBag } from "@/components/blocks/empty-bag"
import { EmptyOffline } from "@/components/blocks/empty-offline"
import { EmptySearch } from "@/components/blocks/empty-search"

const meta = {
  title: "Blocks/Empty",
  component: EmptySearch,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmptySearch>

export default meta

type Story = StoryObj<typeof meta>

export const Search: Story = {}

export const Bag: Story = { render: () => <EmptyBag /> }

export const Offline: Story = { render: () => <EmptyOffline /> }
