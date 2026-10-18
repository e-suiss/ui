import { XIcon } from "phosphor-react-native"
import { Image as NativeImage } from "react-native"
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

export default function AttachmentImage() {
  return (
    <Attachment orientation="horizontal" state="done">
      <AttachmentMedia variant="image">
        <Thumbnail />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Lake.jpg</AttachmentTitle>
        <AttachmentDescription>3.2 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction accessibilityLabel="Remove">
          <Icon as={XIcon} />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}
