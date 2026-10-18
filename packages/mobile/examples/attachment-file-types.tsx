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
      {[
        {
          name: "Invoice.pdf",
          meta: "128 KB",
          extension: "pdf",
          tone: "bg-red-500",
        },
        {
          name: "Menu.xlsx",
          meta: "2.4 MB",
          extension: "xlsx",
          tone: "bg-green-500",
        },
        {
          name: "Contract.docx",
          meta: "84 KB",
          extension: "docx",
          tone: "bg-blue-500",
        },
        {
          name: "Pitch.key",
          meta: "12 MB",
          extension: "key",
          tone: "bg-orange-500",
        },
        { name: "Archive.zip", meta: "48 MB", extension: "zip", tone: "" },
      ].map((file) => (
        <Attachment key={file.name} orientation="horizontal" state="done">
          <AttachmentMedia variant="document">
            <AttachmentLabel className={file.tone}>
              {file.extension}
            </AttachmentLabel>
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.meta}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </View>
  )
}
