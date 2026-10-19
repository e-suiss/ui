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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function GiftCardRedeem() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redeem a gift card</CardTitle>
        <CardDescription>
          Enter the 6-character code on the back of your card.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4 rounded-xl bg-muted p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-card">
            <IconPlaceholder
              phosphor="WalletIcon"
              lucide="WalletIcon"
              tabler="IconWallet"
              hugeicons="Wallet01Icon"
              remixicon="RiWalletLine"
              className="size-5"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">
              Current balance
            </span>
            <span className="font-semibold text-2xl tabular-nums">$42.50</span>
          </div>
        </div>
        <Field>
          <FieldLabel htmlFor="gift-card-code">Gift card code</FieldLabel>
          <InputOTP
            id="gift-card-code"
            maxLength={6}
            pattern="^[a-zA-Z0-9]+$"
            defaultValue="K7M"
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>
            Codes are not case-sensitive. Balance never expires.
          </FieldDescription>
        </Field>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Redeem</Button>
      </CardFooter>
    </Card>
  )
}
