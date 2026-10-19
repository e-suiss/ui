import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function Playlist() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Up Next</CardTitle>
        <CardDescription>5 tracks, 21 minutes</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <IconPlaceholder
              phosphor="ListPlusIcon"
              lucide="ListPlusIcon"
              tabler="IconPlaylistAdd"
              hugeicons="ListPlusIcon"
              remixicon="RiPlayListAddLine"
              data-icon="inline-start"
            />
            Add
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-1">
          <Item size="sm" variant="muted" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="PlayIcon"
                lucide="PlayIcon"
                tabler="IconPlayerPlay"
                hugeicons="PlayIcon"
                remixicon="RiPlayLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Slow Morning Light</ItemTitle>
              <ItemDescription>Harbor Lines</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="secondary">Playing</Badge>
            </ItemActions>
          </Item>
          <Item size="sm" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="MusicNoteIcon"
                lucide="MusicIcon"
                tabler="IconMusic"
                hugeicons="MusicNote01Icon"
                remixicon="RiMusic2Line"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Paper Boats</ItemTitle>
              <ItemDescription>Nora Vale</ItemDescription>
            </ItemContent>
            <ItemActions className="text-muted-foreground text-sm tabular-nums">
              3:42
            </ItemActions>
          </Item>
          <Item size="sm" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="MusicNoteIcon"
                lucide="MusicIcon"
                tabler="IconMusic"
                hugeicons="MusicNote01Icon"
                remixicon="RiMusic2Line"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Glasshouse</ItemTitle>
              <ItemDescription>The Low Tides</ItemDescription>
            </ItemContent>
            <ItemActions className="text-muted-foreground text-sm tabular-nums">
              4:05
            </ItemActions>
          </Item>
          <Item size="sm" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="MusicNoteIcon"
                lucide="MusicIcon"
                tabler="IconMusic"
                hugeicons="MusicNote01Icon"
                remixicon="RiMusic2Line"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Northbound</ItemTitle>
              <ItemDescription>Marlow &amp; Finch</ItemDescription>
            </ItemContent>
            <ItemActions className="text-muted-foreground text-sm tabular-nums">
              5:11
            </ItemActions>
          </Item>
          <Item size="sm" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="MusicNoteIcon"
                lucide="MusicIcon"
                tabler="IconMusic"
                hugeicons="MusicNote01Icon"
                remixicon="RiMusic2Line"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Late Trains</ItemTitle>
              <ItemDescription>Iris Okafor</ItemDescription>
            </ItemContent>
            <ItemActions className="text-muted-foreground text-sm tabular-nums">
              3:58
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
