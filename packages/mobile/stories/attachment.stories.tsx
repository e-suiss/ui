import type { Meta, StoryObj } from "@storybook/react-native"
import {
  CheckCircleIcon,
  DownloadSimpleIcon,
  FilePdfIcon,
  FileTextIcon,
  UploadSimpleIcon,
  XIcon,
} from "phosphor-react-native"
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
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Icon } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"

const imageUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"

const meta = {
  title: "Components/Attachment",
  component: Attachment,
  args: {
    size: "default",
    orientation: "horizontal",
    state: "done",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm", "xs"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    state: {
      control: "select",
      options: ["idle", "uploading", "processing", "error", "done"],
    },
  },
} satisfies Meta<typeof Attachment>

export default meta

type Story = StoryObj<typeof meta>

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

export const Default: Story = {
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia variant="document">
        <AttachmentLabel className="bg-red">pdf</AttachmentLabel>
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Quarterly report.pdf</AttachmentTitle>
        <AttachmentDescription>2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction accessibilityLabel="Remove">
          <Icon as={XIcon} />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <View className="items-start gap-3">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Attachment key={size} {...args} size={size}>
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
  ),
}

export const States: Story = {
  render: (args) => (
    <View className="gap-3">
      <Attachment {...args} state="idle" className="w-full">
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
      <Attachment {...args} state="uploading" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red">pdf</AttachmentLabel>
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
      <Attachment {...args} state="processing" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>Processing…</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <Spinner size={20} />
        </AttachmentActions>
      </Attachment>
      <Attachment {...args} state="error" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-orange">key</AttachmentLabel>
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
      <Attachment {...args} state="done" className="w-full">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red">pdf</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>1.1 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </View>
  ),
}

export const Image: Story = {
  render: (args) => (
    <Attachment {...args}>
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
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <View className="flex-row items-start gap-3">
      <Attachment {...args}>
        <AttachmentMedia variant="image">
          <Thumbnail />
        </AttachmentMedia>
        <AttachmentActions>
          <AttachmentAction accessibilityLabel="Remove">
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment {...args}>
        <AttachmentMedia>
          <Icon as={FilePdfIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Contract.pdf</AttachmentTitle>
          <AttachmentDescription>860 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </View>
  ),
}

export const Pressable: Story = {
  render: (args) => (
    <Attachment {...args}>
      <AttachmentTrigger
        accessibilityLabel="Open Brand guidelines.pdf"
        onPress={() => undefined}
      />
      <AttachmentMedia variant="document">
        <AttachmentLabel className="bg-red">pdf</AttachmentLabel>
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
  ),
}

export const Group: Story = {
  render: (args) => (
    <AttachmentGroup>
      <Attachment {...args} state="uploading">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red">pdf</AttachmentLabel>
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
      <Attachment {...args} state="processing">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-blue">docx</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Contract.docx</AttachmentTitle>
          <AttachmentDescription>Processing…</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <Spinner size={20} />
        </AttachmentActions>
      </Attachment>
      <Attachment {...args}>
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-green">xlsx</AttachmentLabel>
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
              className="size-6 text-success"
            />
          </View>
        </AttachmentActions>
      </Attachment>
      <Attachment {...args}>
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
      <Attachment {...args} state="error">
        <AttachmentMedia variant="document">
          <AttachmentLabel className="bg-red">pdf</AttachmentLabel>
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
  ),
}

export const FileTypes: Story = {
  render: (args) => (
    <View className="items-start gap-3">
      {[
        {
          name: "Invoice.pdf",
          meta: "128 KB",
          extension: "pdf",
          tone: "bg-red",
        },
        {
          name: "Menu.xlsx",
          meta: "2.4 MB",
          extension: "xlsx",
          tone: "bg-green",
        },
        {
          name: "Contract.docx",
          meta: "84 KB",
          extension: "docx",
          tone: "bg-blue",
        },
        {
          name: "Pitch.key",
          meta: "12 MB",
          extension: "key",
          tone: "bg-orange",
        },
        { name: "Archive.zip", meta: "48 MB", extension: "zip", tone: "" },
      ].map((file) => (
        <Attachment key={file.name} {...args}>
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
  ),
}
