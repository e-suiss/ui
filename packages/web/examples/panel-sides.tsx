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

export default function PanelSides() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-wrap items-center gap-3">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Panel key={side}>
            <PanelTrigger render={<Button variant="outline" />}>
              {side.charAt(0).toUpperCase() + side.slice(1)}
            </PanelTrigger>
            <PanelContent side={side}>
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
                <PanelClose render={<Button variant="secondary" />}>
                  Cancel
                </PanelClose>
              </PanelFooter>
            </PanelContent>
          </Panel>
        ))}
      </div>
    </div>
  )
}
