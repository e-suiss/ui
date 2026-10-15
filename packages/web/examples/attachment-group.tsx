import { CheckCircleIcon, XIcon } from "@phosphor-icons/react"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"

const imageUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"

export default function AttachmentGroupExample() {
  return (
    <div className="w-96">
      <AttachmentGroup>
        <Attachment orientation="horizontal" state="uploading">
          <AttachmentMedia variant="document">
            <AttachmentLabel className="bg-red-600">pdf</AttachmentLabel>
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Invoice_1042.pdf</AttachmentTitle>
            <AttachmentProgress value={64} aria-label="Uploading" />
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Cancel upload">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="horizontal" state="processing">
          <AttachmentMedia variant="document">
            <AttachmentLabel className="bg-blue-600">docx</AttachmentLabel>
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Contract.docx</AttachmentTitle>
            <AttachmentDescription>Processing…</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Spinner className="size-5 text-label-secondary" />
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="horizontal" state="done">
          <AttachmentMedia variant="document">
            <AttachmentLabel className="bg-green-700">xlsx</AttachmentLabel>
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Menu_October.xlsx</AttachmentTitle>
            <AttachmentDescription>2.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <CheckCircleIcon
              weight="fill"
              aria-label="Uploaded"
              className="size-6 text-success"
            />
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="horizontal" state="done">
          <AttachmentMedia variant="image">
            <img src={imageUrl} alt="Mountain lake" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Table_12.jpg</AttachmentTitle>
            <AttachmentDescription>1.8 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="horizontal" state="error">
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
      </AttachmentGroup>
    </div>
  )
}
