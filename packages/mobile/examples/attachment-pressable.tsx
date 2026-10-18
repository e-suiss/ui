import { DownloadSimpleIcon } from "phosphor-react-native"
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
import { Icon } from "@/components/ui/icon"

export default function AttachmentPressable() {
  return (
    <Attachment orientation="horizontal" state="done">
      <AttachmentTrigger
        accessibilityLabel="Open Brand guidelines.pdf"
        onPress={() => undefined}
      />
      <AttachmentMedia variant="document">
        <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Brand guidelines.pdf</AttachmentTitle>
        <AttachmentDescription>5.8 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction accessibilityLabel="Download">
          <Icon as={DownloadSimpleIcon} />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}
