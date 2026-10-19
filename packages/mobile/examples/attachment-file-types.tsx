import { View } from "react-native"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

export default function AttachmentFileTypes() {
  return (
    <View className="items-start gap-3">
      <Attachment orientation="horizontal" state="done">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice.pdf</AttachmentTitle>
          <AttachmentDescription>128 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment orientation="horizontal" state="done">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-green-500">xlsx</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Menu.xlsx</AttachmentTitle>
          <AttachmentDescription>2.4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment orientation="horizontal" state="done">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-blue-500">docx</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Contract.docx</AttachmentTitle>
          <AttachmentDescription>84 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment orientation="horizontal" state="done">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-orange-500">key</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Pitch.key</AttachmentTitle>
          <AttachmentDescription>12 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment orientation="horizontal" state="done">
        <AttachmentMedia variant="document">
          <AttachmentLabel>zip</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Archive.zip</AttachmentTitle>
          <AttachmentDescription>48 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </View>
  )
}
