import { Navbar } from "@/components/patterns/navbar"
import { Button } from "@/components/ui/button"

export default function NavbarCrowded() {
  return (
    <div className="min-h-96">
      <div data-testid="frame" className="w-160 max-w-full">
        <Navbar
          items={[
            "Store",
            "Laptop",
            "Tablet",
            "Phone",
            "Watch",
            "Headphones",
            "Speakers",
            "Accessories",
            "Support",
          ].map((label) => ({ label, href: `#${label.toLowerCase()}` }))}
          brand={<span className="text-base font-semibold">Acme</span>}
          actions={
            <Button size="sm" variant="secondary">
              Sign in
            </Button>
          }
        />
      </div>
    </div>
  )
}
