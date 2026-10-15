import {
  Panel,
  PanelBody,
  PanelClose,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  PanelTrigger,
} from "@/components/patterns/panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Side = "top" | "right" | "bottom" | "left"

function ProfilePanel({
  side,
  showCloseButton,
  closeLabel,
}: {
  side?: Side
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <PanelContent
      side={side}
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
    >
      <PanelHeader>
        <PanelTitle>Edit profile</PanelTitle>
        <PanelDescription>
          Update your details and save when you are done.
        </PanelDescription>
      </PanelHeader>
      <PanelBody className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="panel-name">Name</Label>
          <Input id="panel-name" defaultValue="Jordan Lee" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="panel-username">Username</Label>
          <Input id="panel-username" defaultValue="@jordanlee" />
        </div>
      </PanelBody>
      <PanelFooter>
        <Button>Save changes</Button>
        <PanelClose render={<Button variant="secondary" />}>Cancel</PanelClose>
      </PanelFooter>
    </PanelContent>
  )
}

export default function PanelDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Panel>
        <PanelTrigger render={<Button variant="outline" />}>
          Edit profile
        </PanelTrigger>
        <ProfilePanel />
      </Panel>
    </div>
  )
}
