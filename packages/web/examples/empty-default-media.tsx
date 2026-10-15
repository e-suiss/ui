import { FolderSimpleIcon } from "@phosphor-icons/react"
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
            <FolderSimpleIcon className="text-muted-foreground size-12" />
          </EmptyMedia>
          <EmptyTitle>This folder is empty</EmptyTitle>
          <EmptyDescription>Drag files here to add them.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
