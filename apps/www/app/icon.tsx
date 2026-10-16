import { iconImage } from "@/lib/og"

export const size = { width: 512, height: 512 }
export const contentType = "image/png"

export default function Icon() {
  return iconImage(512)
}

export const dynamic = "force-static"
