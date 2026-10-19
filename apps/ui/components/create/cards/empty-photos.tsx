import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyPhotos() {
  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPlaceholder
                phosphor="SquaresFourIcon"
                lucide="LayoutGridIcon"
                tabler="IconLayoutGrid"
                hugeicons="GridViewIcon"
                remixicon="RiLayoutGridLine"
              />
            </EmptyMedia>
            <EmptyTitle>No photos yet</EmptyTitle>
            <EmptyDescription>
              Photos and videos you add will show up here, sorted by day and
              place.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button>
                <IconPlaceholder
                  phosphor="UploadSimpleIcon"
                  lucide="UploadIcon"
                  tabler="IconUpload"
                  hugeicons="Upload01Icon"
                  remixicon="RiUploadLine"
                  data-icon="inline-start"
                />
                Upload
              </Button>
              <Button variant="outline">
                <IconPlaceholder
                  phosphor="FolderOpenIcon"
                  lucide="FolderSearchIcon"
                  tabler="IconFolderSearch"
                  hugeicons="FolderSearchIcon"
                  remixicon="RiFolderOpenLine"
                  data-icon="inline-start"
                />
                Import
              </Button>
            </div>
            <Button variant="link" size="sm" className="text-muted-foreground">
              Learn about shared albums
              <IconPlaceholder
                phosphor="ArrowUpRightIcon"
                lucide="ArrowUpRightIcon"
                tabler="IconArrowUpRight"
                hugeicons="ArrowUpRight01Icon"
                remixicon="RiArrowRightUpLine"
                data-icon="inline-end"
              />
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
