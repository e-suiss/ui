import type { Meta, StoryObj } from "@storybook/react-vite"

import { NavCategories } from "@/components/blocks/nav-categories"
import { NavGlobal } from "@/components/blocks/nav-global"
import { NavLocal } from "@/components/blocks/nav-local"

const meta = {
  title: "Blocks/Navigation",
  component: NavGlobal,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NavGlobal>

export default meta

type Story = StoryObj<typeof meta>

export const Global: Story = {}

export const Local: Story = { render: () => <NavLocal /> }

export const Categories: Story = { render: () => <NavCategories /> }
