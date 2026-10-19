import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  SignaturePad,
  type SignaturePadHandle,
  type SignaturePadStroke,
} from "@/components/ui/signature-pad"
import { Text } from "@/components/ui/text"

function wave(
  startX: number,
  baseY: number,
  length: number,
  amplitude: number,
  turns: number
): SignaturePadStroke {
  return Array.from({ length: 48 }, (_, index) => {
    const progress = index / 47
    return {
      x: startX + progress * length,
      y:
        baseY -
        Math.sin(progress * Math.PI * turns) * amplitude * (1 - progress * 0.4),
    }
  })
}

const SIGNATURE: SignaturePadStroke[] = [
  wave(40, 120, 70, 40, 3),
  wave(110, 115, 110, 22, 5),
  [
    { x: 60, y: 140 },
    { x: 140, y: 136 },
    { x: 230, y: 134 },
  ],
]

export default function SignaturePadControlled() {
  const ref = React.useRef<SignaturePadHandle>(null)
  const [strokes, setStrokes] = React.useState<SignaturePadStroke[]>(SIGNATURE)
  const [size, setSize] = React.useState("")
  return (
    <View className="w-full gap-4">
      <SignaturePad ref={ref} value={strokes} onChange={setStrokes} />
      <Button
        variant="outline"
        onPress={() =>
          setSize(`SVG: ${ref.current?.toSVG().length ?? 0} characters`)
        }
      >
        <Text>Export SVG</Text>
      </Button>
      <Text role="status" className="text-sm text-muted-foreground">
        {`${strokes.length} strokes${size ? ` · ${size}` : ""}`}
      </Text>
    </View>
  )
}
