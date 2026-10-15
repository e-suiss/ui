import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function AspectRatioPlaceholder() {
  return (
    <div className="w-96">
      <AspectRatio
        ratio={4 / 3}
        className="overflow-hidden rounded-2xl bg-muted"
      >
        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
          4:3
        </div>
      </AspectRatio>
    </div>
  )
}
