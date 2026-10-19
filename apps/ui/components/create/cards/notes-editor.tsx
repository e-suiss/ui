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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function NotesEditor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekend plans</CardTitle>
        <CardDescription>Edited 4 minutes ago</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ToggleGroup
            size="sm"
            spacing={0}
            variant="outline"
            multiple
            defaultValue={["bold"]}
            aria-label="Text style"
          >
            <ToggleGroupItem value="bold" aria-label="Bold">
              <IconPlaceholder
                phosphor="TextBIcon"
                lucide="BoldIcon"
                tabler="IconBold"
                hugeicons="TextBoldIcon"
                remixicon="RiBold"
              />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <IconPlaceholder
                phosphor="TextItalicIcon"
                lucide="ItalicIcon"
                tabler="IconItalic"
                hugeicons="TextItalicIcon"
                remixicon="RiItalic"
              />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <IconPlaceholder
                phosphor="TextUnderlineIcon"
                lucide="UnderlineIcon"
                tabler="IconUnderline"
                hugeicons="TextUnderlineIcon"
                remixicon="RiUnderline"
              />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation="vertical" className="mx-1 h-5 self-center" />
          <ToggleGroup
            size="sm"
            spacing={0}
            variant="outline"
            multiple={false}
            defaultValue={["left"]}
            aria-label="Alignment"
          >
            <ToggleGroupItem value="left" aria-label="Align left">
              <IconPlaceholder
                phosphor="TextAlignLeftIcon"
                lucide="TextAlignStartIcon"
                tabler="IconAlignLeft"
                hugeicons="TextAlignLeftIcon"
                remixicon="RiAlignLeft"
              />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <IconPlaceholder
                phosphor="TextAlignCenterIcon"
                lucide="TextAlignCenterIcon"
                tabler="IconAlignCenter"
                hugeicons="TextAlignCenterIcon"
                remixicon="RiAlignCenter"
              />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <IconPlaceholder
                phosphor="TextAlignRightIcon"
                lucide="TextAlignEndIcon"
                tabler="IconAlignRight"
                hugeicons="TextAlignRightIcon"
                remixicon="RiAlignRight"
              />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Textarea
          aria-label="Note"
          className="min-h-32"
          defaultValue="Farmers market on Saturday morning, then a slow lunch by the river. Pick up film for the old camera and call Grandma about Sunday dinner."
        />
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-muted-foreground text-sm tabular-nums">
          25 words
        </span>
        <div className="flex gap-2">
          <Button variant="ghost">Discard</Button>
          <Button>Save</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
