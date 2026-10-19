import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function EnvironmentVariables() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment variables</CardTitle>
        <CardDescription>Encrypted at rest.</CardDescription>
        <CardAction>
          <Select defaultValue="Production">
            <SelectTrigger size="sm" aria-label="Environment">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Preview">Preview</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="grid grid-cols-[2fr_3fr_auto] gap-2 text-muted-foreground">
          <Label className="text-xs text-muted-foreground">Key</Label>
          <Label className="text-xs text-muted-foreground">Value</Label>
          <span className="w-8" />
        </div>
        <div className="grid grid-cols-[2fr_3fr_auto] items-center gap-2">
          <Input
            aria-label="Key"
            defaultValue="DATABASE_URL"
            className="font-mono text-xs"
          />
          <InputGroup>
            <InputGroupInput
              aria-label="Value"
              type="password"
              defaultValue="postgres://app:secret@db:5432"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Show value">
                <IconPlaceholder
                  phosphor="LockSimpleIcon"
                  lucide="LockIcon"
                  tabler="IconLock"
                  hugeicons="SquareLock02Icon"
                  remixicon="RiLockLine"
                />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Button variant="ghost" size="icon-sm" aria-label="Remove">
            <IconPlaceholder
              phosphor="TrashIcon"
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              remixicon="RiDeleteBinLine"
            />
          </Button>
        </div>
        <div className="grid grid-cols-[2fr_3fr_auto] items-center gap-2">
          <Input
            aria-label="Key"
            defaultValue="AUTH_SECRET"
            className="font-mono text-xs"
          />
          <InputGroup>
            <InputGroupInput
              aria-label="Value"
              type="password"
              defaultValue="b7c1e9a04f2d6c83"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Show value">
                <IconPlaceholder
                  phosphor="LockSimpleIcon"
                  lucide="LockIcon"
                  tabler="IconLock"
                  hugeicons="SquareLock02Icon"
                  remixicon="RiLockLine"
                />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Button variant="ghost" size="icon-sm" aria-label="Remove">
            <IconPlaceholder
              phosphor="TrashIcon"
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              remixicon="RiDeleteBinLine"
            />
          </Button>
        </div>
        <div className="grid grid-cols-[2fr_3fr_auto] items-center gap-2">
          <Input
            aria-label="Key"
            defaultValue="MAIL_API_KEY"
            className="font-mono text-xs"
          />
          <InputGroup>
            <InputGroupInput
              aria-label="Value"
              type="password"
              defaultValue="mk_live_29fa81"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Show value">
                <IconPlaceholder
                  phosphor="LockSimpleIcon"
                  lucide="LockIcon"
                  tabler="IconLock"
                  hugeicons="SquareLock02Icon"
                  remixicon="RiLockLine"
                />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Button variant="ghost" size="icon-sm" aria-label="Remove">
            <IconPlaceholder
              phosphor="TrashIcon"
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              remixicon="RiDeleteBinLine"
            />
          </Button>
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
          Add variable
        </Button>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}
