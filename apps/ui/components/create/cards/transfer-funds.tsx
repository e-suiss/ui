import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const accounts = [
  { value: "checking", label: "Everyday checking ·· 4821" },
  { value: "savings", label: "High-yield savings ·· 0937" },
  { value: "travel", label: "Travel fund ·· 5512" },
]

export function TransferFunds() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer funds</CardTitle>
        <CardDescription>Move money between your accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>From</FieldLabel>
            <Select items={accounts} defaultValue="checking">
              <SelectTrigger aria-label="From account" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="checking">
                    Everyday checking ·· 4821
                  </SelectItem>
                  <SelectItem value="savings">
                    High-yield savings ·· 0937
                  </SelectItem>
                  <SelectItem value="travel">Travel fund ·· 5512</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>To</FieldLabel>
            <Select items={accounts} defaultValue="savings">
              <SelectTrigger aria-label="To account" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="checking">
                    Everyday checking ·· 4821
                  </SelectItem>
                  <SelectItem value="savings">
                    High-yield savings ·· 0937
                  </SelectItem>
                  <SelectItem value="travel">Travel fund ·· 5512</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="transfer-amount">Amount</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="transfer-amount"
                inputMode="decimal"
                defaultValue="250.00"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>USD</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="transfer-note">Note</FieldLabel>
            <Textarea
              id="transfer-note"
              placeholder="What's this for?"
              className="min-h-16"
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button block>
          <IconPlaceholder
            phosphor="PaperPlaneTiltIcon"
            lucide="SendIcon"
            tabler="IconSend"
            hugeicons="SentIcon"
            remixicon="RiSendPlaneLine"
            data-icon="inline-start"
          />
          Send $250.00
        </Button>
      </CardFooter>
    </Card>
  )
}
