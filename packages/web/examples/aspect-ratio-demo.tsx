import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <div className="w-96">
      <AspectRatio
        ratio={16 / 9}
        className="overflow-hidden rounded-2xl bg-muted"
      >
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
          alt="Mountain lake at sunrise"
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}
