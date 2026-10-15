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

const imageUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"

export default function AttachmentFileList() {
  return (
    <div className="flex w-96 flex-col gap-3">
      <Attachment orientation="horizontal" state="done" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-600">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice_1042.pdf</AttachmentTitle>
          <AttachmentDescription>128 KB</AttachmentDescription>
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
      <Attachment orientation="horizontal" state="done" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-green-700">xlsx</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Menu_October.xlsx</AttachmentTitle>
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
      <Attachment orientation="horizontal" state="done" className="w-full">
        <AttachmentMedia variant="image">
          <img src={imageUrl} alt="Mountain lake" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Table_12.jpg</AttachmentTitle>
          <AttachmentDescription>1.8 MB</AttachmentDescription>
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
      <Attachment orientation="horizontal" state="error" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-600">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Z-Report_30-09.pdf</AttachmentTitle>
          <AttachmentDescription>Upload failed</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction variant="link">Try Again</AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  )
}
