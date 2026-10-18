import { CheckCircleIcon, XIcon } from "phosphor-react-native"
import { Image as NativeImage, View } from "react-native"
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
import { Icon } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"

const imageUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"

function Thumbnail() {
  return (
    <NativeImage
      source={{ uri: imageUrl }}
      accessibilityLabel="Mountain lake"
      className="size-full"
      resizeMode="cover"
    />
  )
}

export default function AttachmentGroupExample() {
  return (
    <AttachmentGroup>
      <Attachment orientation="horizontal" state="uploading">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice_1042.pdf</AttachmentTitle>
          <AttachmentProgress value={64} accessibilityLabel="Uploading" />
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Cancel upload">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="processing">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-blue-500">docx</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Contract.docx</AttachmentTitle>
          <AttachmentDescription>Processing…</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <Spinner size={20} />
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="done">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-green-500">xlsx</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Menu_October.xlsx</AttachmentTitle>
          <AttachmentDescription>2.4 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <View accessible accessibilityLabel="Uploaded">
            <Icon
              as={CheckCircleIcon}
              weight="fill"
              className="size-6 text-green-600 dark:text-green-400"
            />
          </View>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="done">
        <AttachmentMedia variant="image">
          <Thumbnail />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Table_12.jpg</AttachmentTitle>
          <AttachmentDescription>1.8 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Remove">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="horizontal" state="error">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
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
  )
}
