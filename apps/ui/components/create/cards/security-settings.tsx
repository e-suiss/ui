import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Switch } from "@/components/ui/switch"

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Protect your account and devices.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="security-2fa">Two-factor sign in</FieldLabel>
              <FieldDescription>
                Ask for a code on new devices.
              </FieldDescription>
            </FieldContent>
            <Switch id="security-2fa" defaultChecked />
          </Field>
          <Field>
            <FieldLabel htmlFor="security-code">Verification code</FieldLabel>
            <InputOTP id="security-code" maxLength={6} defaultValue="4821">
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
              Sent to your phone ending in 42.
            </FieldDescription>
          </Field>
          <FieldSeparator />
          <Field>
            <FieldLabel>Active sessions</FieldLabel>
            <ItemGroup className="gap-2">
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <IconPlaceholder
                    phosphor="DesktopIcon"
                    lucide="MonitorIcon"
                    tabler="IconDeviceDesktop"
                    hugeicons="ComputerIcon"
                    remixicon="RiComputerLine"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Studio desktop</ItemTitle>
                  <ItemDescription>Lisbon · Active now</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant="outline">This device</Badge>
                </ItemActions>
              </Item>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <IconPlaceholder
                    phosphor="DeviceMobileIcon"
                    lucide="SmartphoneIcon"
                    tabler="IconDeviceMobile"
                    hugeicons="SmartPhone01Icon"
                    remixicon="RiSmartphoneLine"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Pocket phone</ItemTitle>
                  <ItemDescription>Porto · 2 hours ago</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm">
                    Sign out
                  </Button>
                </ItemActions>
              </Item>
            </ItemGroup>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
