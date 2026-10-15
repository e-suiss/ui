import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function EmptyDemo() {
  return (
    <div className="w-[32rem]">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconPlaceholder
              lucide="FolderIcon"
              tabler="IconFolder"
              hugeicons="Folder01Icon"
              phosphor="FolderSimpleIcon"
              remixicon="RiFolderLine"
            />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>Create project</Button>
            <Button variant="outline">Import project</Button>
          </div>
          <Button variant="link" size="sm" className="text-muted-foreground">
            Learn more
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRight01Icon"
              phosphor="ArrowUpRightIcon"
              remixicon="RiArrowRightUpLine"
              data-icon="inline-end"
            />
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
