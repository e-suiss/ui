import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function FileUpload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload files</CardTitle>
        <CardDescription>Add receipts to your March expenses.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Empty className="border p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPlaceholder
                phosphor="UploadSimpleIcon"
                lucide="UploadIcon"
                tabler="IconUpload"
                hugeicons="Upload01Icon"
                remixicon="RiUploadLine"
              />
            </EmptyMedia>
            <EmptyTitle>Drop files here</EmptyTitle>
            <EmptyDescription>PDF, PNG or JPG up to 10 MB</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Browse files
            </Button>
          </EmptyContent>
        </Empty>
        <Attachment state="uploading" className="w-full">
          <AttachmentMedia variant="document">
            <AttachmentLabel>pdf</AttachmentLabel>
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Hotel receipt.pdf</AttachmentTitle>
            <AttachmentProgress value={64} aria-label="Uploading" />
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Cancel upload">
              <IconPlaceholder
                phosphor="XIcon"
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                remixicon="RiCloseLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="done" className="w-full">
          <AttachmentMedia variant="document">
            <AttachmentLabel>png</AttachmentLabel>
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Train ticket.png</AttachmentTitle>
            <AttachmentDescription>820 KB · Uploaded</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove">
              <IconPlaceholder
                phosphor="TrashIcon"
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="Delete02Icon"
                remixicon="RiDeleteBinLine"
              />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </CardContent>
    </Card>
  )
}
