import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"

export function FamilySharing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Family sharing</CardTitle>
        <CardDescription>4 of 6 seats used</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ItemGroup>
          <Item size="sm" className="px-0">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Maya Lindqvist</ItemTitle>
              <ItemDescription>maya@example.com</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge>Organizer</Badge>
            </ItemActions>
          </Item>
          <Item size="sm" className="px-0">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Jonas Lindqvist</ItemTitle>
              <ItemDescription>jonas@example.com</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="secondary">Parent</Badge>
            </ItemActions>
          </Item>
          <Item size="sm" className="px-0">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>EL</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Elsa Lindqvist</ItemTitle>
              <ItemDescription>Age 12</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">Child</Badge>
            </ItemActions>
          </Item>
          <Item size="sm" className="px-0">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>NR</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Noor Rahimi</ItemTitle>
              <ItemDescription>Invite pending</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="ghost">Invited</Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
        <Separator />
        <Field>
          <FieldLabel htmlFor="family-invite">Invite someone</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <IconPlaceholder
                phosphor="EnvelopeSimpleIcon"
                lucide="MailIcon"
                tabler="IconMail"
                hugeicons="Mail01Icon"
                remixicon="RiMailLine"
              />
            </InputGroupAddon>
            <InputGroupInput
              id="family-invite"
              type="email"
              placeholder="name@example.com"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Invite</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </CardContent>
    </Card>
  )
}
