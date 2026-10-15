import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

const imageUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"

export default function AttachmentVertical() {
  return (
    <div className="flex items-start gap-3">
      <Attachment orientation="vertical" state="done">
        <AttachmentMedia variant="image">
          <img src={imageUrl} alt="Mountain lake" />
        </AttachmentMedia>
        <AttachmentActions>
          <AttachmentAction variant="secondary" aria-label="Remove">
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
      <Attachment orientation="vertical" state="done">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileTypePdf"
            hugeicons="Pdf01Icon"
            phosphor="FilePdfIcon"
            remixicon="RiFilePdf2Line"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Contract.pdf</AttachmentTitle>
          <AttachmentDescription>860 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  )
}
