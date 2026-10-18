import { PinPad } from "@/components/ui/pin-pad"

export default function PinPadDisabled() {
  return <PinPad defaultValue="12" disabled onBiometric={() => undefined} />
}
