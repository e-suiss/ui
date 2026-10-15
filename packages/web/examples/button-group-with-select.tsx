import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const currencies = [
  { value: "usd", label: "$" },
  { value: "eur", label: "€" },
  { value: "gbp", label: "£" },
  { value: "try", label: "₺" },
]

export default function ButtonGroupWithSelect() {
  return (
    <ButtonGroup orientation="horizontal">
      <ButtonGroup>
        <Select defaultValue="usd" items={currencies}>
          <SelectTrigger aria-label="Currency" className="font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input aria-label="Amount" placeholder="10.00" inputMode="decimal" />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" aria-label="Send">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
