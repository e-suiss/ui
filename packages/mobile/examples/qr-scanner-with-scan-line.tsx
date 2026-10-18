import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import Svg, { Path } from "react-native-svg"
import { Icon } from "@/components/ui/icon"
import { QRScanner, type QRScannerState } from "@/components/ui/qr-scanner"

const MODULES = 21

const MODULE_SIZE = 6

const CODE_SIZE = MODULES * MODULE_SIZE

const FINDERS = [
  [0, 0],
  [0, 14],
  [14, 0],
]

function isDark(row: number, column: number) {
  for (const [top, left] of FINDERS) {
    const i = row - top
    const j = column - left
    if (i >= 0 && i <= 6 && j >= 0 && j <= 6) {
      return (
        i === 0 ||
        i === 6 ||
        j === 0 ||
        j === 6 ||
        (i >= 2 && i <= 4 && j >= 2 && j <= 4)
      )
    }
    const boxTop = top === 0 ? 0 : top - 1
    const boxLeft = left === 0 ? 0 : left - 1
    if (
      row >= boxTop &&
      row <= boxTop + 7 &&
      column >= boxLeft &&
      column <= boxLeft + 7
    ) {
      return false
    }
  }
  return (row * 7 + column * 11 + row * column) % 5 < 2
}

const CODE_PATH = Array.from({ length: MODULES * MODULES }, (_, index) => {
  const row = Math.floor(index / MODULES)
  const column = index % MODULES
  return isDark(row, column)
    ? `M${column * MODULE_SIZE} ${row * MODULE_SIZE}h${MODULE_SIZE}v${MODULE_SIZE}h-${MODULE_SIZE}Z`
    : ""
}).join("")

function QRCode({ color }: PhosphorIconProps) {
  return (
    <Svg width={CODE_SIZE} height={CODE_SIZE}>
      <Path d={CODE_PATH} fill={color} />
    </Svg>
  )
}

function CameraPlaceholder() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View className="mb-12 -rotate-6 rounded-xl bg-white p-2.5">
        <Icon as={QRCode} className="text-black" />
      </View>
    </View>
  )
}

function Scanner({
  state,
  description,
  scanLine,
}: {
  state?: QRScannerState
  description?: string
  scanLine?: boolean
}) {
  const [torch, setTorch] = React.useState(false)
  return (
    <QRScanner
      className="flex-1"
      state={state}
      scanLine={scanLine}
      title="Scan QR code"
      description={description}
      torch={torch}
      onTorchToggle={setTorch}
    >
      <CameraPlaceholder />
    </QRScanner>
  )
}

export default function QrScannerWithScanLine() {
  return <Scanner scanLine description="Hold steady over the code." />
}
