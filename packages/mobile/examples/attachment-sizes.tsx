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
      {(["default", "sm", "xs"] as const).map((size) => (
        <Attachment
          key={size}
          orientation="horizontal"
          state="done"
          size={size}
        >
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
      ))}
    </View>
  )
}
