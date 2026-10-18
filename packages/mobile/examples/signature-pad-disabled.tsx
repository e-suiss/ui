import {
  SignaturePad,
  type SignaturePadStroke,
} from "@/components/ui/signature-pad"

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

export default function SignaturePadDisabled() {
  return <SignaturePad defaultValue={SIGNATURE} disabled />
}
