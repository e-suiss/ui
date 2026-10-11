import type { Meta, StoryObj } from "@storybook/react-native"
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

function ExportDemo() {
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
      <Text role="status" className="text-sm text-label-secondary">
        {`${strokes.length} strokes${size ? ` · ${size}` : ""}`}
      </Text>
    </View>
  )
}

const meta = {
  title: "Components/Signature Pad",
  component: SignaturePad,
} satisfies Meta<typeof SignaturePad>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SignaturePad />,
}

export const Signed: Story = {
  render: () => <SignaturePad defaultValue={SIGNATURE} />,
}

export const ThickStroke: Story = {
  render: () => <SignaturePad defaultValue={SIGNATURE} strokeWidth={5} />,
}

export const Disabled: Story = {
  render: () => <SignaturePad defaultValue={SIGNATURE} disabled />,
}

export const Controlled: Story = {
  render: () => <ExportDemo />,
}
