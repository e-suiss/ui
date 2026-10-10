import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/patterns/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

function ModalDemo({
  defaultOpen,
  floating,
}: {
  defaultOpen?: boolean
  floating?: boolean
}) {
  return (
    <View className="items-start">
      <Modal defaultOpen={defaultOpen} floating={floating}>
        <ModalTrigger render={<Button variant="outline" />}>
          <Text>Edit profile</Text>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit profile</ModalTitle>
            <ModalDescription>Make changes to your profile.</ModalDescription>
          </ModalHeader>
          <ModalBody className="gap-3">
            <Input defaultValue="Pedro Duarte" accessibilityLabel="Name" />
            <Input defaultValue="@peduarte" accessibilityLabel="Username" />
          </ModalBody>
          <ModalFooter>
            <ModalClose render={<Button variant="secondary" />}>
              <Text>Cancel</Text>
            </ModalClose>
            <Button>
              <Text>Save changes</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  )
}

const meta = {
  title: "Patterns/Modal",
  component: Modal,
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ModalDemo />,
}

export const OpenByDefault: Story = {
  render: () => <ModalDemo defaultOpen />,
}

export const Floating: Story = {
  render: () => <ModalDemo floating />,
}
