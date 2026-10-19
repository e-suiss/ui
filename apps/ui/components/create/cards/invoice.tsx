import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function Invoice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice #1048</CardTitle>
        <CardDescription>Due November 2, 2026</CardDescription>
        <CardAction>
          <Badge variant="outline">
            <IconPlaceholder
              phosphor="ClockIcon"
              lucide="ClockIcon"
              tabler="IconClock"
              hugeicons="Clock01Icon"
              remixicon="RiTimeLine"
              data-icon="inline-start"
            />
            Due in 14 days
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Billed to</span>
            <span className="font-medium">Maya Lindqvist</span>
            <span className="text-muted-foreground">Harbor Studio</span>
          </div>
          <div className="flex flex-col gap-0.5 text-end">
            <span className="text-muted-foreground">Issued</span>
            <span className="font-medium">Oct 19, 2026</span>
            <span className="text-muted-foreground">Net 14</span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-medium">Brand workshop</span>
              <span className="text-muted-foreground">2 days × $1,200</span>
            </div>
            <span className="tabular-nums">$2,400.00</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-medium">Logo refinement</span>
              <span className="text-muted-foreground">12 hours × $95</span>
            </div>
            <span className="tabular-nums">$1,140.00</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-medium">Print-ready files</span>
              <span className="text-muted-foreground">Flat fee</span>
            </div>
            <span className="tabular-nums">$360.00</span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums">$3,900.00</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax (8%)</span>
            <span className="tabular-nums">$312.00</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="tabular-nums">$4,212.00</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          <IconPlaceholder
            phosphor="DownloadSimpleIcon"
            lucide="DownloadIcon"
            tabler="IconDownload"
            hugeicons="Download01Icon"
            remixicon="RiDownloadLine"
            data-icon="inline-start"
          />
          Download
        </Button>
        <Button className="flex-1">
          <IconPlaceholder
            phosphor="CreditCardIcon"
            lucide="CreditCardIcon"
            tabler="IconCreditCard"
            hugeicons="CreditCardIcon"
            remixicon="RiBankCardLine"
            data-icon="inline-start"
          />
          Pay now
        </Button>
      </CardFooter>
    </Card>
  )
}
