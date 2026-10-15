import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { nativeExamples } from "@/lib/native-examples.mjs"

type NativeCode = { rn?: string; swift?: string; kotlin?: string }

const previews = path.join(process.cwd(), "public/previews")
const mobileRoot = path.join(process.cwd(), "../../packages/mobile")

let examples: Map<string, NativeCode> | undefined

export function nativeCode(id: string): NativeCode {
  examples ??= nativeExamples(mobileRoot) as Map<string, NativeCode>
  return examples.get(id) ?? {}
}

function webpSize(file: string) {
  const bytes = readFileSync(file)
  const format = bytes.toString("ascii", 12, 16)
  if (format === "VP8 ")
    return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff]
  if (format === "VP8L") {
    const bits = bytes.readUInt32LE(21)
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1]
  }
  if (format === "VP8X")
    return [1 + bytes.readUIntLE(24, 3), 1 + bytes.readUIntLE(27, 3)]
  return undefined
}

export function nativePreview(id: string) {
  const image = path.join(previews, `${id}.light.webp`)
  if (!existsSync(image)) return undefined
  const [width, height] = webpSize(image) ?? []
  return {
    width,
    height,
    video: existsSync(path.join(previews, `${id}.light.mp4`)),
  }
}
