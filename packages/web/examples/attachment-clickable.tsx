import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"

export default function AttachmentClickable() {
  return (
    <Attachment orientation="horizontal" state="done">
      <AttachmentTrigger aria-label="Open Brand guidelines.pdf" />
      <AttachmentMedia variant="document">
        <AttachmentLabel className="bg-red-600">pdf</AttachmentLabel>
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Brand guidelines.pdf</AttachmentTitle>
        <AttachmentDescription>5.8 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Download">
          <IconPlaceholder
            lucide="DownloadIcon"
            tabler="IconDownload"
            hugeicons="Download01Icon"
            phosphor="DownloadSimpleIcon"
            remixicon="RiDownloadLine"
          />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}
