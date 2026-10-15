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
} from "@/components/ui/attachment"

export default function AttachmentDemo() {
  return (
    <Attachment orientation="horizontal" state="done">
      <AttachmentMedia variant="document">
        <AttachmentLabel className="bg-red-600">pdf</AttachmentLabel>
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Quarterly report.pdf</AttachmentTitle>
        <AttachmentDescription>2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove">
          <IconPlaceholder
            lucide="XIcon"
            tabler="IconX"
            hugeicons="Cancel01Icon"
            phosphor="XIcon"
            remixicon="RiCloseLine"
          />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}
