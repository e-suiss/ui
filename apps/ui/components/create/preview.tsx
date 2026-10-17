"use client"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { strings } from "@/lib/strings"

export function CreatePreview() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{strings.createAccountTitle}</CardTitle>
          <CardDescription>{strings.createAccountDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-email">{strings.createEmail}</Label>
            <Input id="create-email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-password">{strings.createPassword}</Label>
            <Input id="create-password" type="password" defaultValue="secret" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="create-terms" defaultChecked />
            <Label htmlFor="create-terms">{strings.createTerms}</Label>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button className="flex-1">{strings.createSubmit}</Button>
          <Button variant="outline" className="flex-1">
            {strings.createCancel}
          </Button>
        </CardFooter>
      </Card>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-start"
            />
            {strings.createNew}
          </Button>
          <Button variant="secondary">{strings.createSecondary}</Button>
          <Button variant="outline">{strings.createOutline}</Button>
          <Button variant="ghost">{strings.createGhost}</Button>
          <Button variant="destructive">{strings.createDelete}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{strings.createBadge}</Badge>
          <Badge variant="secondary">{strings.createSecondary}</Badge>
          <Badge variant="outline">{strings.createOutline}</Badge>
          <Badge variant="destructive">{strings.createDelete}</Badge>
        </div>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">
              {strings.createAccountTab}
            </TabsTrigger>
            <TabsTrigger value="billing">
              {strings.createBillingTab}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="flex flex-col gap-4 pt-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="create-notifications">
                {strings.createNotifications}
              </Label>
              <Switch id="create-notifications" defaultChecked />
            </div>
            <Slider defaultValue={[60]} aria-label={strings.createVolume} />
            <Progress value={66} aria-label={strings.createProgress} />
          </TabsContent>
          <TabsContent value="billing" className="pt-2">
            <Progress value={33} aria-label={strings.createProgress} />
          </TabsContent>
        </Tabs>
        <Alert>
          <IconPlaceholder
            lucide="InfoIcon"
            tabler="IconInfoCircle"
            hugeicons="InformationCircleIcon"
            phosphor="InfoIcon"
            remixicon="RiInformationLine"
          />
          <AlertTitle>{strings.createAlertTitle}</AlertTitle>
          <AlertDescription>{strings.createAlertDescription}</AlertDescription>
        </Alert>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            {strings.createMenu}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{strings.createMenuLabel}</DropdownMenuLabel>
              <DropdownMenuItem>{strings.createProfile}</DropdownMenuItem>
              <DropdownMenuItem>{strings.createSettings}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              {strings.createSignOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
