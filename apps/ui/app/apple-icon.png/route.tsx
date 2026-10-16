import { iconImage } from "@/lib/og"

export function GET() {
  return iconImage(180)
}

export const dynamic = "force-static"
