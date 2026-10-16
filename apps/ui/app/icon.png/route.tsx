import { iconImage } from "@/lib/og"

export function GET() {
  return iconImage(512)
}

export const dynamic = "force-static"
