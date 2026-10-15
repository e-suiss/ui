import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function EmptyDefaultMedia() {
  return (
    <div className="w-[32rem]">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <IconPlaceholder
              lucide="FolderIcon"
              tabler="IconFolder"
              hugeicons="Folder01Icon"
              phosphor="FolderSimpleIcon"
              remixicon="RiFolderLine"
              className="text-muted-foreground size-12"
            />
          </EmptyMedia>
          <EmptyTitle>This folder is empty</EmptyTitle>
          <EmptyDescription>Drag files here to add them.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
