import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"

export function Shortcuts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard shortcuts</CardTitle>
        <CardDescription>Move faster without the mouse.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-muted-foreground">General</p>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>Search</span>
            <KbdGroup>
              <Kbd mod />
              <Kbd>K</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>New document</span>
            <KbdGroup>
              <Kbd mod />
              <Kbd>N</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>Toggle sidebar</span>
            <KbdGroup>
              <Kbd mod />
              <Kbd>B</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>Open settings</span>
            <KbdGroup>
              <Kbd mod />
              <Kbd>,</Kbd>
            </KbdGroup>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-muted-foreground">Editing</p>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>Bold</span>
            <KbdGroup>
              <Kbd mod />
              <Kbd>B</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>Undo</span>
            <KbdGroup>
              <Kbd mod />
              <Kbd>Z</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>Redo</span>
            <KbdGroup>
              <Kbd mod />
              <Kbd>⇧</Kbd>
              <Kbd>Z</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>Go to line</span>
            <KbdGroup>
              <Kbd>G</Kbd>
              <span className="text-xs text-muted-foreground">then</span>
              <Kbd>L</Kbd>
            </KbdGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
