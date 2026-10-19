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
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function PaymentMethod() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>Choose how you want to pay.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <RadioGroup defaultValue="card" aria-label="Payment method">
            <FieldLabel htmlFor="payment-card">
              <Field orientation="horizontal">
                <IconPlaceholder
                  phosphor="CreditCardIcon"
                  lucide="CreditCardIcon"
                  tabler="IconCreditCard"
                  hugeicons="CreditCardIcon"
                  remixicon="RiBankCardLine"
                  className="size-5 text-muted-foreground"
                />
                <FieldContent>
                  <FieldTitle>Card</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="card" id="payment-card" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="payment-wallet">
              <Field orientation="horizontal">
                <IconPlaceholder
                  phosphor="WalletIcon"
                  lucide="WalletIcon"
                  tabler="IconWallet"
                  hugeicons="Wallet01Icon"
                  remixicon="RiWalletLine"
                  className="size-5 text-muted-foreground"
                />
                <FieldContent>
                  <FieldTitle>Wallet</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="wallet" id="payment-wallet" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="payment-bank">
              <Field orientation="horizontal">
                <IconPlaceholder
                  phosphor="StorefrontIcon"
                  lucide="StoreIcon"
                  tabler="IconBuildingStore"
                  hugeicons="Store01Icon"
                  remixicon="RiStore2Line"
                  className="size-5 text-muted-foreground"
                />
                <FieldContent>
                  <FieldTitle>Bank transfer</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="bank" id="payment-bank" />
              </Field>
            </FieldLabel>
          </RadioGroup>
          <Field>
            <FieldLabel htmlFor="payment-number">Card number</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="payment-number"
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
              />
              <InputGroupAddon align="inline-end">
                <IconPlaceholder
                  phosphor="LockSimpleIcon"
                  lucide="LockIcon"
                  tabler="IconLock"
                  hugeicons="SquareLock02Icon"
                  remixicon="RiLockLine"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="payment-expiry">Expiry</FieldLabel>
              <Input id="payment-expiry" placeholder="MM / YY" />
            </Field>
            <Field>
              <FieldLabel htmlFor="payment-cvc">CVC</FieldLabel>
              <Input id="payment-cvc" placeholder="123" inputMode="numeric" />
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Pay $48.00</Button>
      </CardFooter>
    </Card>
  )
}
