import { FileTextIcon, XIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Icon } from "@/components/ui/icon"

export default function AttachmentSizes() {
  return (
    <View className="items-start gap-3">
      <Attachment orientation="horizontal" state="done" size="default">
        <AttachmentMedia>
          <Icon as={FileTextIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Meeting notes.docx</AttachmentTitle>
          <AttachmentDescription>184 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Remove">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="done" size="sm">
        <AttachmentMedia>
          <Icon as={FileTextIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Meeting notes.docx</AttachmentTitle>
          <AttachmentDescription>184 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Remove">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="done" size="xs">
        <AttachmentMedia>
          <Icon as={FileTextIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Meeting notes.docx</AttachmentTitle>
          <AttachmentDescription>184 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Remove">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </View>
  )
}
