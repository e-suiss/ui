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

export default function PanelWithoutCloseButton() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Panel>
        <PanelTrigger asChild>
          <Button variant="outline">Edit profile</Button>
        </PanelTrigger>
        <PanelContent showCloseButton={false}>
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
            <PanelClose asChild>
              <Button variant="secondary">Cancel</Button>
            </PanelClose>
          </PanelFooter>
        </PanelContent>
      </Panel>
    </div>
  )
}
