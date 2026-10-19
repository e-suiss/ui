import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"

export function ApiKeys() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API keys</CardTitle>
        <CardDescription>Use these keys to call the API.</CardDescription>
        <CardAction>
          <Button size="sm">
            <IconPlaceholder
              phosphor="PlusIcon"
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              remixicon="RiAddLine"
              data-icon="inline-start"
            />
            Create key
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="key-production">Production</FieldLabel>
            <Button variant="ghost" size="xs" className="text-destructive">
              Revoke
            </Button>
          </div>
          <InputGroup>
            <InputGroupAddon>
              <IconPlaceholder
                phosphor="KeyIcon"
                lucide="KeyIcon"
                tabler="IconKey"
                hugeicons="Key01Icon"
                remixicon="RiKey2Line"
              />
            </InputGroupAddon>
            <InputGroupInput
              id="key-production"
              defaultValue="sk_live_••••••••••••4f9a"
              className="font-mono"
              readOnly
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Copy key">
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
            Created Sep 12, 2026 · Used 2h ago
          </FieldDescription>
        </Field>
        <Separator />
        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="key-staging">Staging</FieldLabel>
            <Button variant="ghost" size="xs" className="text-destructive">
              Revoke
            </Button>
          </div>
          <InputGroup>
            <InputGroupAddon>
              <IconPlaceholder
                phosphor="KeyIcon"
                lucide="KeyIcon"
                tabler="IconKey"
                hugeicons="Key01Icon"
                remixicon="RiKey2Line"
              />
            </InputGroupAddon>
            <InputGroupInput
              id="key-staging"
              defaultValue="sk_test_••••••••••••81c0"
              className="font-mono"
              readOnly
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Copy key">
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
          <FieldDescription>Created Aug 3, 2026 · Never used</FieldDescription>
        </Field>
      </CardContent>
    </Card>
  )
}
