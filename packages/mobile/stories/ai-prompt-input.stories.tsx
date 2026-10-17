import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ArrowUpIcon,
  CaretDownIcon,
  FileTextIcon,
  PlusIcon,
  XIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Text } from "@/components/ui/text"

const meta = {
  title: "AI/Prompt Input",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon align="block-start">
        <Attachment size="xs">
          <AttachmentMedia>
            <Icon as={FileTextIcon} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>settings-page.tsx</AttachmentTitle>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction accessibilityLabel="Remove">
              <Icon as={XIcon} />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </InputGroupAddon>
      <InputGroupTextarea
        placeholder="Ask the agent to change your code..."
        numberOfLines={3}
      />
      <InputGroupAddon align="block-end" className="justify-between">
        <InputGroupButton size="icon-xs" accessibilityLabel="Attach a file">
          <Icon as={PlusIcon} />
        </InputGroupButton>
        <View className="flex-row items-center gap-2">
          <InputGroupButton size="xs">
            <Text>Claude Opus 5.5</Text>
            <Icon as={CaretDownIcon} />
          </InputGroupButton>
          <InputGroupButton
            variant="default"
            size="icon-xs"
            accessibilityLabel="Send"
          >
            <Icon as={ArrowUpIcon} />
          </InputGroupButton>
        </View>
      </InputGroupAddon>
    </InputGroup>
  ),
}
