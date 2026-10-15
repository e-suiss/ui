import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const products = [
  {
    title: "Analytics",
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
    title: "Automations",
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
    title: "Security",
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
]

const resources = [
  {
    title: "Documentation",
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
    title: "API reference",
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
    title: "Help center",
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
]

export default function NavigationMenuOpenByDefault() {
  return (
    <div className="flex min-h-96 items-start justify-center">
      <NavigationMenu align="start" defaultValue="products">
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-96 gap-1">
                {products.map((product) => (
                  <li key={product.title}>
                    <NavigationMenuLink href="#" className="items-start gap-3">
                      {product.icon}
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{product.title}</span>
                        <span className="text-muted-foreground">
                          {product.description}
                        </span>
                      </div>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="resources">
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-56 gap-1">
                {resources.map((resource) => (
                  <li key={resource.title}>
                    <NavigationMenuLink href="#">
                      {resource.icon}
                      {resource.title}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className={navigationMenuTriggerStyle()}
            >
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
