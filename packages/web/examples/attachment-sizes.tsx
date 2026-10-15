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

export default function AttachmentSizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Attachment
          key={size}
          orientation="horizontal"
          state="done"
          size={size}
        >
          <AttachmentMedia>
            <IconPlaceholder
              lucide="FileTextIcon"
              tabler="IconFileText"
              hugeicons="File02Icon"
              phosphor="FileTextIcon"
              remixicon="RiFileTextLine"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Meeting notes.docx</AttachmentTitle>
            <AttachmentDescription>184 KB</AttachmentDescription>
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
      ))}
    </div>
  )
}
