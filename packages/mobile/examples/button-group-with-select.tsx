import { ArrowRightIcon } from "phosphor-react-native"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const currencies: Option[] = [
  { value: "usd", label: "$" },
  { value: "eur", label: "€" },
  { value: "gbp", label: "£" },
  { value: "try", label: "₺" },
]

function CurrencyExample() {
  const [value, setValue] = React.useState<string | null>("usd")
  return (
    <ButtonGroup className="self-stretch">
      <ButtonGroup className="flex-1">
        <Select items={currencies} value={value} onValueChange={setValue}>
          <SelectTrigger accessibilityLabel="Currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {currencies.map((currency) => (
                <SelectItem
                  key={currency.value}
                  value={currency.value}
                  label={currency.label}
                />
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          accessibilityLabel="Amount"
          placeholder="10.00"
          inputMode="decimal"
          className="w-auto flex-1"
        />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" accessibilityLabel="Send">
          <Icon as={ArrowRightIcon} />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}

export default function ButtonGroupWithSelect() {
  return <CurrencyExample />
}
