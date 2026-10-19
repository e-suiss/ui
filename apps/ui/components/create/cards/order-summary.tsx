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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"

export function OrderSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your bag</CardTitle>
        <CardDescription>3 items ready for checkout</CardDescription>
        <CardAction>
          <Badge variant="secondary">Free shipping</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ItemGroup>
          <Item size="sm" className="px-0">
            <ItemMedia variant="icon" className="size-12 rounded-lg bg-muted">
              <IconPlaceholder
                phosphor="CoffeeIcon"
                lucide="CoffeeIcon"
                tabler="IconCoffee"
                hugeicons="CoffeeIcon"
                remixicon="RiCupLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Ceramic mug</ItemTitle>
              <ItemDescription>Sand, 350 ml</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-col items-end gap-1">
              <span className="font-medium text-sm tabular-nums">$36.00</span>
              <NativeSelect size="sm" defaultValue="2" aria-label="Quantity">
                <NativeSelectOption value="1">1</NativeSelectOption>
                <NativeSelectOption value="2">2</NativeSelectOption>
                <NativeSelectOption value="3">3</NativeSelectOption>
              </NativeSelect>
            </ItemActions>
          </Item>
          <Item size="sm" className="px-0">
            <ItemMedia variant="icon" className="size-12 rounded-lg bg-muted">
              <IconPlaceholder
                phosphor="BookOpenIcon"
                lucide="BookOpenIcon"
                tabler="IconBook"
                hugeicons="BookOpen02Icon"
                remixicon="RiBookOpenLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Linen notebook</ItemTitle>
              <ItemDescription>A5, dotted</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-col items-end gap-1">
              <span className="font-medium text-sm tabular-nums">$18.00</span>
              <NativeSelect size="sm" defaultValue="1" aria-label="Quantity">
                <NativeSelectOption value="1">1</NativeSelectOption>
                <NativeSelectOption value="2">2</NativeSelectOption>
                <NativeSelectOption value="3">3</NativeSelectOption>
              </NativeSelect>
            </ItemActions>
          </Item>
          <Item size="sm" className="px-0">
            <ItemMedia variant="icon" className="size-12 rounded-lg bg-muted">
              <IconPlaceholder
                phosphor="SunIcon"
                lucide="SunIcon"
                tabler="IconSun"
                hugeicons="Sun03Icon"
                remixicon="RiSunLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Desk lamp</ItemTitle>
              <ItemDescription>Warm white</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-col items-end gap-1">
              <span className="font-medium text-sm tabular-nums">$64.00</span>
              <NativeSelect size="sm" defaultValue="1" aria-label="Quantity">
                <NativeSelectOption value="1">1</NativeSelectOption>
                <NativeSelectOption value="2">2</NativeSelectOption>
                <NativeSelectOption value="3">3</NativeSelectOption>
              </NativeSelect>
            </ItemActions>
          </Item>
        </ItemGroup>
        <Separator />
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="text-end tabular-nums">$118.00</dd>
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="text-end tabular-nums">$0.00</dd>
          <dt className="text-muted-foreground">Tax</dt>
          <dd className="text-end tabular-nums">$9.44</dd>
          <dt className="pt-1 font-semibold text-base">Total</dt>
          <dd className="pt-1 text-end font-semibold text-base tabular-nums">
            $127.44
          </dd>
        </dl>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Checkout
          <IconPlaceholder
            phosphor="ArrowRightIcon"
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
