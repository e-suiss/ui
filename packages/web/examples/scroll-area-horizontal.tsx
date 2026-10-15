import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const albums = [
  { title: "Morning Light", artist: "Nora Hale" },
  { title: "Open Roads", artist: "The Fieldnotes" },
  { title: "Paper Moons", artist: "Ivy Grant" },
  { title: "Low Tide", artist: "Harbor Lines" },
  { title: "Glass Garden", artist: "Mira Stone" },
  { title: "Northbound", artist: "Echo Park" },
  { title: "Slow Motion", artist: "Luca Reyes" },
]

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea className="w-96 rounded-2xl border whitespace-nowrap">
      <div className="flex w-max gap-4 p-4">
        {albums.map((album) => (
          <figure key={album.title} className="w-32 shrink-0">
            <div className="bg-surface-secondary aspect-square rounded-xl" />
            <figcaption className="text-label-secondary pt-2 text-xs">
              <span className="text-label font-medium">{album.title}</span>
              <br />
              {album.artist}
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
