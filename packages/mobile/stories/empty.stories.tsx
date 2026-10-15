import type { Meta, StoryObj } from "@storybook/react-native"
import { FolderOpenIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Empty",
  component: Empty,
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon as={FolderOpenIcon} />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet. Get started by creating your
          first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Text>Create project</Text>
        </Button>
        <Button variant="link">
          <Text>Import project</Text>
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const Muted: Story = {
  render: () => (
    <Empty className="bg-muted">
      <EmptyHeader>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>Try a different search.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}
