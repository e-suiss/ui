import { FilePdfIcon, XIcon } from "phosphor-react-native"
import { Image as NativeImage, View } from "react-native"
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

export default function AttachmentVertical() {
  return (
    <View className="flex-row items-start gap-3">
      <Attachment orientation="vertical" state="done">
        <AttachmentMedia variant="image">
          <Thumbnail />
        </AttachmentMedia>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Remove">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical" state="done">
        <AttachmentMedia>
          <Icon as={FilePdfIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Contract.pdf</AttachmentTitle>
          <AttachmentDescription>860 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </View>
  )
}
