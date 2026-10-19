import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function InviteTeam() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite your team</CardTitle>
        <CardDescription>
          Teammates get an email to join this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="invite-email-1">Email addresses</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="invite-email-1"
                type="email"
                defaultValue="lena@harbor.team"
                className="min-w-0 flex-1"
              />
              <Select defaultValue="Editor">
                <SelectTrigger aria-label="Role" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                aria-label="Email address"
                placeholder="name@example.com"
                className="min-w-0 flex-1"
              />
              <Select defaultValue="Viewer">
                <SelectTrigger aria-label="Role" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" className="w-fit">
              <IconPlaceholder
                phosphor="PlusIcon"
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                remixicon="RiAddLine"
                data-icon="inline-start"
              />
              Add another
            </Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            or
          </FieldSeparator>
          <Field>
            <FieldLabel htmlFor="invite-link">Share an invite link</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <IconPlaceholder
                  phosphor="LinkIcon"
                  lucide="LinkIcon"
                  tabler="IconLink"
                  hugeicons="Link01Icon"
                  remixicon="RiLinksLine"
                />
              </InputGroupAddon>
              <InputGroupInput
                id="invite-link"
                defaultValue="harbor.team/join/k8f2-x9qa"
                readOnly
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" aria-label="Copy link">
                  <IconPlaceholder
                    phosphor="CopyIcon"
                    lucide="CopyIcon"
                    tabler="IconCopy"
                    hugeicons="Copy01Icon"
                    remixicon="RiFileCopyLine"
                  />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>
              Anyone with the link joins as a viewer.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Send invites</Button>
      </CardFooter>
    </Card>
  )
}
