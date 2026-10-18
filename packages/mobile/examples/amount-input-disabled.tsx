import { AmountInput } from "@/components/ui/amount-input"

export default function AmountInputDisabled() {
  return (
    <AmountInput currency="USD" locale="en-US" defaultValue="42" disabled />
  )
}
