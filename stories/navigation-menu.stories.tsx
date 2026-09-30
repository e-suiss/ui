import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  BookOpenIcon,
  ChartLineIcon,
  CodeIcon,
  LifebuoyIcon,
  LightningIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react"

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
    icon: ChartLineIcon,
  },
  {
    title: "Automations",
    description: "Run workflows when events happen.",
    icon: LightningIcon,
  },
  {
    title: "Security",
    description: "Single sign-on, audit logs, and roles.",
    icon: ShieldCheckIcon,
  },
]

const resources = [
  { title: "Documentation", icon: BookOpenIcon },
  { title: "API reference", icon: CodeIcon },
  { title: "Help center", icon: LifebuoyIcon },
]

const meta = {
  title: "Components/Navigation Menu",
  component: NavigationMenu,
  args: {
    align: "start",
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
  },
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-96 justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavigationMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 gap-1">
              {products.map((product) => (
                <li key={product.title}>
                  <NavigationMenuLink href="#" className="items-start gap-3">
                    <product.icon className="mt-0.5" />
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
                    <resource.icon />
                    {resource.title}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultValue: "products" },
}

export const LinksOnly: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        {["Overview", "Customers", "Changelog", "Blog"].map((label, index) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuLink
              href="#"
              active={index === 0}
              className={navigationMenuTriggerStyle()}
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
