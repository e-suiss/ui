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
import { Slider } from "@/components/ui/slider"

export function NowPlaying() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Now Playing</CardTitle>
        <CardDescription>Living room speaker</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="Like">
            <IconPlaceholder
              phosphor="HeartIcon"
              lucide="HeartIcon"
              tabler="IconHeart"
              hugeicons="FavouriteIcon"
              remixicon="RiHeartLine"
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <IconPlaceholder
              phosphor="MusicNotesIcon"
              lucide="Music2Icon"
              tabler="IconMusic"
              hugeicons="MusicNote02Icon"
              remixicon="RiMusicLine"
              className="size-8"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="truncate font-medium">Slow Morning Light</div>
            <div className="truncate text-muted-foreground text-sm">
              Harbor Lines
            </div>
            <div className="truncate text-muted-foreground text-xs">
              Quiet Coast, 2025
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Slider
            defaultValue={[38]}
            max={100}
            aria-label="Playback position"
          />
          <div className="flex justify-between text-muted-foreground text-xs tabular-nums">
            <span>1:24</span>
            <span>-2:18</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="icon-lg" aria-label="Previous track">
            <IconPlaceholder
              phosphor="CaretDoubleLeftIcon"
              lucide="ChevronsLeftIcon"
              tabler="IconChevronsLeft"
              hugeicons="ArrowLeftDoubleIcon"
              remixicon="RiArrowLeftDoubleLine"
            />
          </Button>
          <Button size="icon-xl" aria-label="Pause">
            <IconPlaceholder
              phosphor="PauseIcon"
              lucide="PauseIcon"
              tabler="IconPlayerPause"
              hugeicons="PauseIcon"
              remixicon="RiPauseLine"
            />
          </Button>
          <Button variant="ghost" size="icon-lg" aria-label="Next track">
            <IconPlaceholder
              phosphor="CaretDoubleRightIcon"
              lucide="ChevronsRightIcon"
              tabler="IconChevronsRight"
              hugeicons="ArrowRightDoubleIcon"
              remixicon="RiArrowRightDoubleLine"
            />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="gap-3">
        <IconPlaceholder
          phosphor="SpeakerHighIcon"
          lucide="Volume2Icon"
          tabler="IconVolume"
          hugeicons="VolumeHighIcon"
          remixicon="RiVolumeUpLine"
          className="size-4 shrink-0 text-muted-foreground"
        />
        <Slider defaultValue={[64]} max={100} aria-label="Volume" />
      </CardFooter>
    </Card>
  )
}
