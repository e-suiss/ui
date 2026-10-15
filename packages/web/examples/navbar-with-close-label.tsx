import {
  BookOpenIcon,
  ChartLineIcon,
  CodeIcon,
  LifebuoyIcon,
  LightningIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react"
import { Navbar, type NavbarItem } from "@/components/patterns/navbar"

const items: NavbarItem[] = [
  {
    label: "Products",
    items: [
      {
        label: "Analytics",
        href: "#analytics",
        description: "Track traffic and conversions in real time.",
        icon: <ChartLineIcon className="mt-0.5" />,
      },
      {
        label: "Automations",
        href: "#automations",
        description: "Run workflows when events happen.",
        icon: <LightningIcon className="mt-0.5" />,
      },
      {
        label: "Security",
        href: "#security",
        description: "Single sign-on, audit logs, and roles.",
        icon: <ShieldCheckIcon className="mt-0.5" />,
      },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", href: "#docs", icon: <BookOpenIcon /> },
      { label: "API reference", href: "#api", icon: <CodeIcon /> },
      { label: "Help center", href: "#help", icon: <LifebuoyIcon /> },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
]

const brand = <span className="text-base font-semibold">Acme</span>

export default function NavbarWithCloseLabel() {
  return (
    <div className="min-h-96">
      <Navbar items={items} brand={brand} closeLabel="Done" />
    </div>
  )
}
