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
    <div className="flex flex-col gap-3">
      {[
        {
          name: "Invoice.pdf",
          meta: "128 KB",
          extension: "pdf",
          tone: "bg-red-600",
        },
        {
          name: "Menu.xlsx",
          meta: "2.4 MB",
          extension: "xlsx",
          tone: "bg-green-700",
        },
        {
          name: "Contract.docx",
          meta: "84 KB",
          extension: "docx",
          tone: "bg-blue-600",
        },
        {
          name: "Pitch.key",
          meta: "12 MB",
          extension: "key",
          tone: "bg-orange-700",
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
      <Attachment orientation="horizontal" state="done">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-blue-600">MD</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>README.md</AttachmentTitle>
          <AttachmentDescription>4 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  )
}
