import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function Reminders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
        <CardDescription>3 of 5 left for this week</CardDescription>
        <CardAction>
          <Badge variant="outline">Home</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Checkbox id="reminder-plants" />
          <Label htmlFor="reminder-plants" className="flex-1">
            Water the plants
          </Label>
          <Badge variant="destructive">Today</Badge>
        </div>
        <Separator />
        <div className="flex items-center gap-3">
          <Checkbox id="reminder-filter" />
          <Label htmlFor="reminder-filter" className="flex-1">
            Replace air filter
          </Label>
          <Badge variant="secondary">Tomorrow</Badge>
        </div>
        <Separator />
        <div className="flex items-center gap-3">
          <Checkbox id="reminder-vet" />
          <Label htmlFor="reminder-vet" className="flex-1">
            Book vet visit for Milo
          </Label>
          <Badge variant="secondary">Thu</Badge>
        </div>
        <Separator />
        <div className="flex items-center gap-3">
          <Checkbox id="reminder-rent" defaultChecked />
          <Label
            htmlFor="reminder-rent"
            className="flex-1 text-muted-foreground line-through"
          >
            Pay rent
          </Label>
          <Badge variant="outline">Done</Badge>
        </div>
        <Separator />
        <div className="flex items-center gap-3">
          <Checkbox id="reminder-library" defaultChecked />
          <Label
            htmlFor="reminder-library"
            className="flex-1 text-muted-foreground line-through"
          >
            Return library books
          </Label>
          <Badge variant="outline">Done</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <InputGroup>
          <InputGroupInput placeholder="Add a reminder" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Add reminder">
              <IconPlaceholder
                phosphor="PlusIcon"
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                remixicon="RiAddLine"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </CardFooter>
    </Card>
  )
}
