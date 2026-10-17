import { iconImage } from "@/lib/og"

export function GET() {
  return iconImage(180, { tile: true })
}

export const dynamic = "force-static"
