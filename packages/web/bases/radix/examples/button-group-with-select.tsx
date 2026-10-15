import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
        <Select defaultValue="usd">
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
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
