import type { Meta, StoryObj } from "@storybook/react-vite"

import { RolesEditor } from "@/components/blocks/roles-editor"
import { RolesMatrix } from "@/components/blocks/roles-matrix"
import { RolesRequests } from "@/components/blocks/roles-requests"

const meta = {
  title: "Blocks/Roles",
  component: RolesMatrix,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RolesMatrix>

export default meta

type Story = StoryObj<typeof meta>

export const Matrix: Story = {}

export const Editor: Story = { render: () => <RolesEditor /> }

export const Requests: Story = { render: () => <RolesRequests /> }
