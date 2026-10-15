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
import { Spinner } from "@/components/ui/spinner"

export default function AttachmentStates() {
  return (
    <div className="flex w-96 flex-col gap-3">
      <Attachment orientation="horizontal" state="idle" className="w-full">
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
          <AttachmentTitle>Drop a file here</AttachmentTitle>
          <AttachmentDescription>
            PDF, PNG or JPG up to 10 MB
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction variant="link">Choose File</AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="uploading" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-600">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentProgress value={64} aria-label="Uploading" />
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
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
      <Attachment
        orientation="horizontal"
        state="processing"
        className="w-full"
      >
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-600">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>Processing…</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <Spinner className="size-5 text-muted-foreground" />
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="error" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-orange-700">key</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Presentation.key</AttachmentTitle>
          <AttachmentDescription>File type not supported</AttachmentDescription>
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
          <AttachmentLabel className="bg-red-600">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>1.1 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  )
}
