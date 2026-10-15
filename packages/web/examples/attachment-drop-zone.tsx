import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"

export default function AttachmentDropZone() {
  return (
    <Attachment orientation="horizontal" state="idle" className="w-96">
      <AttachmentTrigger aria-label="Choose a file to upload" />
      <AttachmentMedia>
        <IconPlaceholder
          lucide="UploadIcon"
          tabler="IconUpload"
          hugeicons="Upload01Icon"
          phosphor="UploadSimpleIcon"
          remixicon="RiUploadLine"
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Drop a file or click to choose</AttachmentTitle>
        <AttachmentDescription>
          PDF, PNG or JPG up to 10 MB
        </AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  )
}
