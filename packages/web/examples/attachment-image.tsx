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

export default function AttachmentImage() {
  return (
    <Attachment orientation="horizontal" state="done">
      <AttachmentMedia variant="image">
        <img src={imageUrl} alt="Mountain lake" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Lake.jpg</AttachmentTitle>
        <AttachmentDescription>3.2 MB</AttachmentDescription>
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
