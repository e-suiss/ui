import { Navbar } from "@/components/patterns/navbar"

const brand = <span className="text-base font-semibold">Acme</span>

export default function NavbarLinksOnly() {
  return (
    <div className="min-h-96">
      <Navbar
        items={[
          { label: "Overview", href: "#overview", active: true },
          { label: "Customers", href: "#customers" },
          { label: "Changelog", href: "#changelog" },
          { label: "Blog", href: "#blog" },
        ]}
        brand={brand}
      />
    </div>
  )
}
