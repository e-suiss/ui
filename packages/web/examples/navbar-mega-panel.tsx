import { Navbar } from "@/components/patterns/navbar"

const brand = <span className="text-base font-semibold">Acme</span>

export default function NavbarMegaPanel() {
  return (
    <div className="min-h-96">
      <Navbar
        items={[
          {
            label: "Products",
            columns: [
              {
                label: "Explore",
                featured: true,
                links: [
                  { label: "Analytics", href: "#analytics" },
                  { label: "Automations", href: "#automations" },
                  { label: "Security", href: "#security" },
                ],
              },
              {
                label: "Get started",
                links: [
                  { label: "Pricing", href: "#pricing" },
                  { label: "Customers", href: "#customers" },
                ],
              },
              {
                label: "Learn",
                links: [
                  { label: "Documentation", href: "#docs" },
                  { label: "Help center", href: "#help" },
                ],
              },
            ],
          },
          { label: "Pricing", href: "#pricing" },
          { label: "Blog", href: "#blog" },
        ]}
        brand={brand}
        layout="panel"
      />
    </div>
  )
}
