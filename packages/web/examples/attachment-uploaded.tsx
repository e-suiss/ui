import { CheckCircleIcon } from "@phosphor-icons/react"
import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

const imageUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"

export default function AttachmentUploaded() {
  return (
    <div className="flex w-96 flex-col gap-3">
      <Attachment orientation="horizontal" state="done" className="w-full">
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
            className="size-6 text-green-600 dark:text-green-400"
          />
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
          <CheckCircleIcon
            weight="fill"
            aria-label="Uploaded"
            className="size-6 text-green-600 dark:text-green-400"
          />
        </AttachmentActions>
      </Attachment>
    </div>
  )
}
