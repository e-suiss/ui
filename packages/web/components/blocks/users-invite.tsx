"use client"

import {
  ChartBarIcon,
  EnvelopeSimpleIcon,
  GearIcon,
  ShieldIcon,
  UsersIcon,
  XIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { createToastManager, Toaster } from "@/components/ui/toast"

const EMAIL = /.+@.+\..+/
const TRAILING_SEPARATOR = /[, ]$/
const TRAILING_COMMA = /,$/

type NavItem = {
  value: string
  label: string
  icon: React.ReactNode
  badge?: React.ReactNode
  group?: string
}

function NavSidebar({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  header,
  footer,
}: {
  items: NavItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  header?: React.ReactNode
  footer?: React.ReactNode
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? items[0]?.value
  )
  const value = valueProp ?? uncontrolledValue
  const groups = [...new Set(items.map((item) => item.group ?? ""))]

  return (
    <Sidebar collapsible="icon">
      {header && (
        <SidebarHeader className="group-data-[collapsible=icon]:hidden">
          {header}
        </SidebarHeader>
      )}
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group}>
            {group && <SidebarGroupLabel>{group}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {items
                  .filter((item) => (item.group ?? "") === group)
                  .map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        isActive={item.value === value}
                        tooltip={item.label}
                        aria-current={item.value === value ? "page" : undefined}
                        onClick={() => {
                          if (valueProp === undefined) {
                            setUncontrolledValue(item.value)
                          }
                          onValueChange?.(item.value)
                          if (isMobile) setOpenMobile(false)
                        }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.badge !== undefined && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {footer && (
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          {footer}
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

const nav: NavItem[] = [
  { value: "users", label: "Users", icon: <UsersIcon /> },
  { value: "roles", label: "Roles", icon: <ShieldIcon /> },
  { value: "log", label: "Activity", icon: <ChartBarIcon /> },
  { value: "settings", label: "Settings", icon: <GearIcon /> },
]

const roles = ["Admin", "Editor", "Support", "Viewer"]

const toasts = createToastManager()

export function UsersInvite() {
  const [emails, setEmails] = React.useState(["avery@company.com"])
  const [draft, setDraft] = React.useState("")
  const [role, setRole] = React.useState("Editor")
  const [welcome, setWelcome] = React.useState(true)
  const [pending, setPending] = React.useState([
    { email: "casey@company.com", role: "Support", sent: "2 days ago" },
    { email: "drew@company.com", role: "Viewer", sent: "5 days ago" },
  ])

  const commit = (value: string) => {
    const email = value.trim().replace(TRAILING_COMMA, "")
    if (EMAIL.test(email) && !emails.includes(email))
      setEmails((current) => [...current, email])
    setDraft("")
  }

  return (
    <Toaster toastManager={toasts}>
      <SidebarProvider>
        <NavSidebar
          items={nav}
          defaultValue="users"
          header={
            <p className="flex items-center gap-2 px-2 pt-1 text-sm font-semibold">
              <span className="font-bold">suiss</span> Admin
            </p>
          }
        />
        <SidebarInset>
          <div className="flex flex-col gap-5 px-5 py-5.5 md:px-7">
            <div className="flex items-start gap-3">
              <SidebarTrigger className="-ms-2 mt-0.5" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Invite users
                </h1>
                <p className="text-sm text-muted-foreground">
                  Invitees get a link by email.
                </p>
              </div>
            </div>
            <ItemGroup variant="inset">
              <Item size="sm" role="listitem" className="items-start">
                <ItemContent className="w-22.5 flex-none pt-1">
                  <ItemTitle className="font-normal">
                    <label htmlFor="users-invite-email">Email</label>
                  </ItemTitle>
                </ItemContent>
                <div className="flex min-h-7.5 flex-1 flex-wrap items-center gap-1.5">
                  {emails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex h-6.5 items-center gap-1 rounded-md bg-secondary ps-2.5 pe-0.5 text-sm"
                    >
                      {email}
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${email}`}
                        onClick={() =>
                          setEmails((current) =>
                            current.filter((item) => item !== email)
                          )
                        }
                        className="size-5.5 text-muted-foreground"
                      >
                        <XIcon weight="bold" className="size-2.5" />
                      </Button>
                    </span>
                  ))}
                  <input
                    id="users-invite-email"
                    type="email"
                    value={draft}
                    onChange={(event) => {
                      const value = event.target.value
                      if (TRAILING_SEPARATOR.test(value)) commit(value)
                      else setDraft(value)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        commit(draft)
                      }
                      if (event.key === "Backspace" && !draft)
                        setEmails((current) => current.slice(0, -1))
                    }}
                    onBlur={() => draft && commit(draft)}
                    placeholder={
                      emails.length ? "Add another" : "name@company.com"
                    }
                    className="min-w-35 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </Item>
              <ItemSeparator />
              <Item size="sm" role="listitem">
                <ItemContent>
                  <ItemTitle className="font-normal">Role</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as string)}
                  >
                    <SelectTrigger
                      size="sm"
                      aria-label="Role"
                      className="h-7.5"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {roles.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ItemActions>
              </Item>
              <ItemSeparator />
              <Item size="sm" role="listitem">
                <ItemContent>
                  <ItemTitle className="font-normal">
                    <label htmlFor="users-invite-welcome">
                      Send welcome email
                    </label>
                  </ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Switch
                    id="users-invite-welcome"
                    checked={welcome}
                    onCheckedChange={setWelcome}
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
            <div className="flex items-center gap-2.5">
              <span
                className="flex-1 text-sm text-muted-foreground"
                aria-live="polite"
              >
                {emails.length
                  ? `${emails.length} ${emails.length === 1 ? "person" : "people"} will be invited as ${role}.`
                  : "Type an email and press Enter."}
              </span>
              <Button
                size="sm"
                disabled={!emails.length}
                onClick={() => {
                  setPending((current) => [
                    ...emails.map((email) => ({
                      email,
                      role,
                      sent: "Just now",
                    })),
                    ...current,
                  ])
                  toasts.add({
                    title: `${emails.length} ${emails.length === 1 ? "invitation" : "invitations"} sent`,
                    type: "success",
                  })
                  setEmails([])
                }}
              >
                Send Invites
              </Button>
            </div>
            <h2 className="-mb-2 px-1 text-sm font-semibold">
              Pending invitations
            </h2>
            {pending.length > 0 ? (
              <ItemGroup
                variant="inset"
                className="**:data-[slot=item-separator]:ms-14"
              >
                {pending.map((invite, index) => (
                  <React.Fragment key={invite.email}>
                    {index > 0 && <ItemSeparator />}
                    <Item
                      size="sm"
                      role="listitem"
                      className="transition-[opacity,translate] duration-700 starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none"
                    >
                      <ItemMedia className="size-7 rounded-[7px] bg-zinc-500 text-white">
                        <EnvelopeSimpleIcon weight="bold" className="size-4" />
                      </ItemMedia>
                      <ItemContent className="gap-0">
                        <ItemTitle className="font-normal">
                          {invite.email}
                        </ItemTitle>
                        <ItemDescription className="text-xs">
                          {invite.role} · {invite.sent}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            toasts.add({
                              title: `Resent to ${invite.email}`,
                              type: "success",
                            })
                          }
                        >
                          Resend
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-[color-mix(in_oklab,var(--destructive),var(--foreground)_20%)] dark:text-[color-mix(in_oklab,var(--destructive),white_20%)]"
                          onClick={() =>
                            setPending((current) =>
                              current.filter(
                                (item) => item.email !== invite.email
                              )
                            )
                          }
                        >
                          Cancel
                        </Button>
                      </ItemActions>
                    </Item>
                  </React.Fragment>
                ))}
              </ItemGroup>
            ) : (
              <p className="px-1 text-sm text-muted-foreground">
                No pending invitations.
              </p>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Toaster>
  )
}
