import { AmountInput } from "@/components/ui/amount-input"

export default function AmountInputWithMax() {
  return <AmountInput currency="USD" locale="en-US" max={500} />
}
