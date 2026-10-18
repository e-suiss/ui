import { XIcon } from "phosphor-react-native"
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
import { Icon } from "@/components/ui/icon"

export default function AttachmentDemo() {
  return (
    <Attachment orientation="horizontal" state="done">
      <AttachmentMedia variant="document">
        <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Quarterly report.pdf</AttachmentTitle>
        <AttachmentDescription>2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction accessibilityLabel="Remove">
          <Icon as={XIcon} />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}
