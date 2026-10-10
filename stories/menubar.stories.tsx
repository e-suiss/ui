import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Text } from "@/components/ui/text"

function MenubarDemo({ disabled = false }: { disabled?: boolean }) {
  const [showBookmarks, setShowBookmarks] = React.useState(true)
  const [showUrls, setShowUrls] = React.useState(false)
  const [profile, setProfile] = React.useState("benoit")

  return (
    <Menubar className="self-start">
      <MenubarMenu>
        <MenubarTrigger>
          <Text>File</Text>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Text>New Tab</Text>
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Text>New Window</Text>
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            <Text>New Incognito Window</Text>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Text>Share</Text>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <Text>Email link</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>Messages</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>Notes</Text>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Text>Print...</Text>
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger disabled={disabled}>
          <Text>Edit</Text>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Text>Undo</Text>
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Text>Redo</Text>
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Text>Cut</Text>
          </MenubarItem>
          <MenubarItem>
            <Text>Copy</Text>
          </MenubarItem>
          <MenubarItem>
            <Text>Paste</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger disabled={disabled}>
          <Text>View</Text>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem
            checked={showBookmarks}
            onCheckedChange={setShowBookmarks}
          >
            <Text>Always Show Bookmarks Bar</Text>
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showUrls} onCheckedChange={setShowUrls}>
            <Text>Always Show Full URLs</Text>
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Reload</Text>
            <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger disabled={disabled}>
          <Text>Profiles</Text>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={profile} onValueChange={setProfile}>
            <MenubarRadioItem value="andy">
              <Text>Andy</Text>
            </MenubarRadioItem>
            <MenubarRadioItem value="benoit">
              <Text>Benoit</Text>
            </MenubarRadioItem>
            <MenubarRadioItem value="luis">
              <Text>Luis</Text>
            </MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Edit...</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const meta = {
  title: "Components/Menubar",
  component: Menubar,
} satisfies Meta<typeof Menubar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <MenubarDemo />,
}

export const Disabled: Story = {
  render: () => <MenubarDemo disabled />,
}
