import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Navbar, type NavbarItem } from "@/components/patterns/navbar"
import { Button } from "@/components/ui/button"

const items: NavbarItem[] = [
  {
    label: "Products",
    items: [
      {
        label: "Analytics",
        href: "#analytics",
        description: "Track traffic and conversions in real time.",
        icon: (
          <IconPlaceholder
            lucide="ChartLineIcon"
            tabler="IconChartLine"
            hugeicons="ChartLineData01Icon"
            phosphor="ChartLineIcon"
            remixicon="RiLineChartLine"
            className="mt-0.5"
          />
        ),
      },
      {
        label: "Automations",
        href: "#automations",
        description: "Run workflows when events happen.",
        icon: (
          <IconPlaceholder
            lucide="ZapIcon"
            tabler="IconBolt"
            hugeicons="ZapIcon"
            phosphor="LightningIcon"
            remixicon="RiFlashlightLine"
            className="mt-0.5"
          />
        ),
      },
      {
        label: "Security",
        href: "#security",
        description: "Single sign-on, audit logs, and roles.",
        icon: (
          <IconPlaceholder
            lucide="ShieldCheckIcon"
            tabler="IconShieldCheck"
            hugeicons="SecurityCheckIcon"
            phosphor="ShieldCheckIcon"
            remixicon="RiShieldCheckLine"
            className="mt-0.5"
          />
        ),
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        label: "Documentation",
        href: "#docs",
        icon: (
          <IconPlaceholder
            lucide="BookOpenIcon"
            tabler="IconBook"
            hugeicons="BookOpen02Icon"
            phosphor="BookOpenIcon"
            remixicon="RiBookOpenLine"
          />
        ),
      },
      {
        label: "API reference",
        href: "#api",
        icon: (
          <IconPlaceholder
            lucide="CodeIcon"
            tabler="IconCode"
            hugeicons="CodeIcon"
            phosphor="CodeIcon"
            remixicon="RiCodeLine"
          />
        ),
      },
      {
        label: "Help center",
        href: "#help",
        icon: (
          <IconPlaceholder
            lucide="LifeBuoyIcon"
            tabler="IconLifebuoy"
            hugeicons="LifebuoyIcon"
            phosphor="LifebuoyIcon"
            remixicon="RiLifebuoyLine"
          />
        ),
      },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
]

export default function NavbarWithActions() {
  return (
    <div className="min-h-96">
      <Navbar
        items={items}
        brand={<span className="text-base font-semibold">Acme</span>}
        actions={
          <Button size="sm" variant="secondary">
            Sign in
          </Button>
        }
      />
    </div>
  )
}
