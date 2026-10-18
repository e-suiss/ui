import { UploadSimpleIcon, XIcon } from "phosphor-react-native"
import { View } from "react-native"
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
import { Icon } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"

export default function AttachmentStates() {
  return (
    <View className="gap-3">
      <Attachment orientation="horizontal" state="idle" className="w-full">
        <AttachmentMedia>
          <Icon as={UploadSimpleIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Add a file</AttachmentTitle>
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
          <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentProgress value={64} accessibilityLabel="Uploading" />
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Cancel upload">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment
        orientation="horizontal"
        state="processing"
        className="w-full"
      >
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>Processing…</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <Spinner size={20} />
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="error" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-orange-500">key</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Presentation.key</AttachmentTitle>
          <AttachmentDescription>File type not supported</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Remove">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="done" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>1.1 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </View>
  )
}
