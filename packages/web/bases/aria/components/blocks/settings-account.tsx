"use client"

import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  collapsible = "icon",
}: {
  collapsible?: "offcanvas" | "icon"
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
    <Sidebar collapsible={collapsible}>
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

const items: NavItem[] = [
  {
    value: "personal",
    label: "Personal Information",
    icon: (
      <IconPlaceholder
        lucide="UserIcon"
        tabler="IconUser"
        hugeicons="UserIcon"
        phosphor="UserIcon"
        remixicon="RiUserLine"
      />
    ),
  },
  {
    value: "security",
    label: "Sign-In & Security",
    icon: (
      <IconPlaceholder
        lucide="KeyIcon"
        tabler="IconKey"
        hugeicons="Key01Icon"
        phosphor="KeyIcon"
        remixicon="RiKey2Line"
      />
    ),
  },
  {
    value: "payment",
    label: "Payment & Shipping",
    icon: (
      <IconPlaceholder
        lucide="CreditCardIcon"
        tabler="IconCreditCard"
        hugeicons="CreditCardIcon"
        phosphor="CreditCardIcon"
        remixicon="RiBankCardLine"
      />
    ),
  },
  {
    value: "subscriptions",
    label: "Subscriptions",
    icon: (
      <IconPlaceholder
        lucide="CloudIcon"
        tabler="IconCloud"
        hugeicons="CloudIcon"
        phosphor="CloudIcon"
        remixicon="RiCloudLine"
      />
    ),
  },
  {
    value: "family",
    label: "Family Sharing",
    icon: (
      <IconPlaceholder
        lucide="UsersIcon"
        tabler="IconUsers"
        hugeicons="UserGroupIcon"
        phosphor="UsersIcon"
        remixicon="RiGroupLine"
      />
    ),
  },
  {
    value: "devices",
    label: "Devices",
    icon: (
      <IconPlaceholder
        lucide="SmartphoneIcon"
        tabler="IconDeviceMobile"
        hugeicons="SmartPhone01Icon"
        phosphor="DeviceMobileIcon"
        remixicon="RiSmartphoneLine"
      />
    ),
  },
  {
    value: "privacy",
    label: "Privacy",
    icon: (
      <IconPlaceholder
        lucide="ShieldIcon"
        tabler="IconShield"
        hugeicons="Shield01Icon"
        phosphor="ShieldIcon"
        remixicon="RiShieldLine"
      />
    ),
  },
]

type Editable = "email" | "phone"

function EditableCard({
  title,
  field,
  value,
  editing,
  onEdit,
  onCancel,
  onSave,
}: {
  title: string
  field: Editable
  value: string
  editing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: (value: string) => void
}) {
  const [draft, setDraft] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!editing) return
    setDraft(value)
    const timer = window.setTimeout(() => inputRef.current?.focus(), 300)
    return () => window.clearTimeout(timer)
  }, [editing, value])

  return (
    <div className="rounded-[1.125rem] bg-muted px-5 py-4.5">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-0.75">
          <h2 className="text-lg font-semibold">{title}</h2>
          {!editing && (
            <p className="text-base text-muted-foreground">{value}</p>
          )}
        </div>
        {!editing && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title.toLowerCase()}`}
            className="rounded-xs text-base text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Edit ›
          </button>
        )}
      </div>
      <div
        data-open={editing ? "" : undefined}
        inert={!editing}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] data-open:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div className="min-h-0 overflow-hidden">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onSave(draft)
            }}
            className="flex flex-col gap-3 pt-3.5"
          >
            <Input
              ref={inputRef}
              name={field}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label={title}
              className="h-12 rounded-xl border-input bg-background text-lg"
            />
            <div className="flex gap-2.5">
              <Button type="submit" size="sm">
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Security() {
  const idPrefix = React.useId()
  const [values, setValues] = React.useState({
    email: "jamie@suiss.com",
    phone: "+1 (415) 555-0142",
  })
  const [editing, setEditing] = React.useState<Editable | null>(null)
  const [passkeys, setPasskeys] = React.useState(true)
  const [saved, setSaved] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!saved) return
    const timer = window.setTimeout(() => setSaved(null), 2200)
    return () => window.clearTimeout(timer)
  }, [saved])

  const cards: { field: Editable; title: string }[] = [
    { field: "email", title: "Email & phone" },
    { field: "phone", title: "Trusted phone number" },
  ]

  return (
    <div className="flex flex-col gap-3.5">
      {cards.map((card) => (
        <EditableCard
          key={card.field}
          title={card.title}
          field={card.field}
          value={values[card.field]}
          editing={editing === card.field}
          onEdit={() => setEditing(card.field)}
          onCancel={() => setEditing(null)}
          onSave={(value) => {
            setValues((current) => ({ ...current, [card.field]: value }))
            setEditing(null)
            setSaved(card.title)
          }}
        />
      ))}
      <div className="flex items-center gap-3 rounded-[1.125rem] bg-muted px-5 py-4.5">
        <div className="flex flex-1 flex-col gap-0.75">
          <label
            htmlFor={`${idPrefix}-passkeys`}
            className="text-lg font-semibold"
          >
            Passkeys
          </label>
          <p className="text-base text-muted-foreground">
            {passkeys ? "On for 3 devices" : "Off"}
          </p>
        </div>
        <Switch
          id={`${idPrefix}-passkeys`}
          isSelected={passkeys}
          onChange={setPasskeys}
        />
      </div>
      <div className="flex items-center gap-3 rounded-[1.125rem] bg-muted px-5 py-4.5">
        <div className="flex flex-1 flex-col gap-0.75">
          <h2 className="text-lg font-semibold">Two-factor authentication</h2>
          <p className="text-base text-muted-foreground">
            Codes are sent to your trusted devices.
          </p>
        </div>
        <span className="text-sm font-semibold text-[color-mix(in_oklab,var(--color-green-500),var(--foreground)_45%)] dark:text-green-500">
          On
        </span>
      </div>
      <p role="status" className="flex min-h-6 items-center gap-1.5 text-sm">
        {saved && (
          <span className="flex items-center gap-1.5 transition-[opacity,translate] duration-800 starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none">
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
              className="size-4 text-[color-mix(in_oklab,var(--color-green-500),var(--foreground)_30%)] dark:text-green-500"
            />
            {saved} saved.
          </span>
        )}
      </p>
    </div>
  )
}

export function SettingsAccount() {
  const [section, setSection] = React.useState("security")
  const current = items.find((item) => item.value === section) ?? items[1]

  return (
    <SidebarProvider>
      <NavSidebar
        items={items}
        value={section}
        onValueChange={setSection}
        collapsible="offcanvas"
        header={
          <div className="flex flex-col gap-2 px-2 pt-2 pb-1">
            <Avatar className="size-18">
              <AvatarFallback className="bg-linear-to-br from-[oklch(0.78_0.1_250)] to-[oklch(0.6_0.15_280)] text-2xl text-white dark:from-[oklch(0.78_0.1_250)] dark:to-[oklch(0.6_0.15_280)]">
                JR
              </AvatarFallback>
            </Avatar>
            <p className="text-2xl font-semibold tracking-tight">
              Jamie Rivera
            </p>
            <p className="text-sm text-muted-foreground">jamie@suiss.com</p>
          </div>
        }
      />
      <SidebarInset>
        <div className="mx-auto flex w-full max-w-170 flex-col gap-3.5 px-5 py-8 md:px-9">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ms-2" />
            <h1 className="text-4xl font-semibold tracking-tight">
              {current?.label}
            </h1>
          </div>
          <div
            key={section}
            className="transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
          >
            {section === "security" ? (
              <Security />
            ) : (
              <p className="text-lg text-muted-foreground">
                This section isn't part of the sample. Choose Sign-In &
                Security.
              </p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
