import {
  CheckCircleIcon,
  DownloadSimpleIcon,
  FilePdfIcon,
  FileTextIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
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

export const Default: Story = {
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia variant="document" extension="pdf" />
      <AttachmentContent>
        <AttachmentTitle>Quarterly report.pdf</AttachmentTitle>
        <AttachmentDescription>2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Attachment key={size} {...args} size={size}>
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Meeting notes.docx</AttachmentTitle>
            <AttachmentDescription>184 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <Attachment {...args} state="idle">
        <AttachmentMedia>
          <UploadSimpleIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Drop a file here</AttachmentTitle>
          <AttachmentDescription>
            PDF, PNG or JPG up to 10 MB
          </AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment {...args} state="uploading">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading, 42%</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment {...args} state="processing">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>Processing</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment {...args} state="error">
        <AttachmentMedia variant="document" extension="key" />
        <AttachmentContent>
          <AttachmentTitle>Presentation.key</AttachmentTitle>
          <AttachmentDescription>File type not supported</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment {...args} state="done">
        <AttachmentMedia variant="document" extension="pdf" />
        <AttachmentContent>
          <AttachmentTitle>Invoice March.pdf</AttachmentTitle>
          <AttachmentDescription>1.1 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  ),
}

export const Image: Story = {
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia variant="image">
        <img src={imageUrl} alt="Mountain lake" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Lake.jpg</AttachmentTitle>
        <AttachmentDescription>3.2 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex items-start gap-3">
      <Attachment {...args}>
        <AttachmentMedia variant="image">
          <img src={imageUrl} alt="Mountain lake" />
        </AttachmentMedia>
        <AttachmentActions>
          <AttachmentAction variant="secondary" aria-label="Remove">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment {...args}>
        <AttachmentMedia>
          <FilePdfIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Contract.pdf</AttachmentTitle>
          <AttachmentDescription>860 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  ),
}

export const Clickable: Story = {
  render: (args) => (
    <Attachment {...args}>
      <AttachmentTrigger aria-label="Open Brand guidelines.pdf" />
      <AttachmentMedia variant="document" extension="pdf" />
      <AttachmentContent>
        <AttachmentTitle>Brand guidelines.pdf</AttachmentTitle>
        <AttachmentDescription>5.8 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Download">
          <DownloadSimpleIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
}

export const Group: Story = {
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <AttachmentGroup>
      {[
        { name: "Roadmap.pdf", meta: "1.2 MB", extension: "pdf" },
        { name: "Notes.txt", meta: "12 KB", extension: "txt" },
        { name: "Archive.zip", meta: "48 MB", extension: "zip" },
        { name: "Budget.pdf", meta: "640 KB", extension: "pdf" },
      ].map((file) => (
        <Attachment key={file.name} {...args}>
          <AttachmentMedia variant="document" extension={file.extension} />
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.meta}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  ),
}

export const FileTypes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {[
        { name: "Invoice.pdf", meta: "128 KB", extension: "pdf" },
        { name: "Menu.xlsx", meta: "2.4 MB", extension: "xlsx" },
        { name: "Contract.docx", meta: "84 KB", extension: "docx" },
        { name: "Pitch.key", meta: "12 MB", extension: "key" },
        { name: "Archive.zip", meta: "48 MB", extension: "zip" },
      ].map((file) => (
        <Attachment key={file.name} {...args}>
          <AttachmentMedia variant="document" extension={file.extension} />
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.meta}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
      <Attachment {...args}>
        <AttachmentMedia variant="document">
          <AttachmentLabel tone="blue">MD</AttachmentLabel>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>README.md</AttachmentTitle>
          <AttachmentDescription>4 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  ),
}

export const FileList: Story = {
  render: (args) => (
    <div className="flex w-96 flex-col gap-3">
      <Attachment {...args} className="w-full">
        <AttachmentMedia variant="document" extension="pdf" />
        <AttachmentContent>
          <AttachmentTitle>Invoice_1042.pdf</AttachmentTitle>
          <AttachmentDescription>128 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment {...args} className="w-full">
        <AttachmentMedia variant="document" extension="xlsx" />
        <AttachmentContent>
          <AttachmentTitle>Menu_October.xlsx</AttachmentTitle>
          <AttachmentDescription>2.4 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment {...args} className="w-full">
        <AttachmentMedia variant="image">
          <img src={imageUrl} alt="Mountain lake" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Table_12.jpg</AttachmentTitle>
          <AttachmentDescription>1.8 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment {...args} state="error" className="w-full">
        <AttachmentMedia variant="document" extension="pdf" />
        <AttachmentContent>
          <AttachmentTitle>Z-Report_30-09.pdf</AttachmentTitle>
          <AttachmentDescription>Upload failed</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  ),
}

export const Uploaded: Story = {
  render: (args) => (
    <div className="flex w-96 flex-col gap-3">
      <Attachment {...args} className="w-full">
        <AttachmentMedia variant="document" extension="xlsx" />
        <AttachmentContent>
          <AttachmentTitle>Menu_October.xlsx</AttachmentTitle>
          <AttachmentDescription>2.4 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <CheckCircleIcon
            weight="fill"
            aria-label="Uploaded"
            className="size-6 text-success"
          />
        </AttachmentActions>
      </Attachment>
      <Attachment {...args} className="w-full">
        <AttachmentMedia variant="image">
          <img src={imageUrl} alt="Mountain lake" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Table_12.jpg</AttachmentTitle>
          <AttachmentDescription>1.8 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <CheckCircleIcon
            weight="fill"
            aria-label="Uploaded"
            className="size-6 text-success"
          />
        </AttachmentActions>
      </Attachment>
    </div>
  ),
}
