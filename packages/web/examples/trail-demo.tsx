import * as React from "react"
import { Trail, type TrailItem } from "@/components/patterns/trail"

const article: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Account", href: "#account" },
  { label: "Security", href: "#security" },
  { label: "Turn on two-factor authentication" },
]

type Page = { label: string; parent?: string; children: string[] }

const pages: Record<string, Page> = {
  support: { label: "Support", children: ["account", "billing"] },
  account: {
    label: "Account",
    parent: "support",
    children: ["security", "profile"],
  },
  billing: { label: "Billing", parent: "support", children: [] },
  security: {
    label: "Security",
    parent: "account",
    children: ["two-factor", "passwords"],
  },
  profile: { label: "Profile", parent: "account", children: [] },
  "two-factor": {
    label: "Turn on two-factor authentication",
    parent: "security",
    children: [],
  },
  passwords: {
    label: "Change your password",
    parent: "security",
    children: [],
  },
}

function pageOf(id: string) {
  const page = pages[id]
  if (!page) throw new Error(`Unknown page ${id}`)
  return page
}

function trailTo(id: string): TrailItem[] {
  const items: TrailItem[] = []
  for (let key: string | undefined = id; key; key = pageOf(key).parent) {
    items.unshift({ label: pageOf(key).label, href: `#${key}` })
  }
  return items.map((item, index) =>
    index === items.length - 1 ? { label: item.label } : item
  )
}

function TrailExample(props: Partial<React.ComponentProps<typeof Trail>>) {
  const [page, setPage] = React.useState("two-factor")
  const current = pageOf(page)

  const navigation = {
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      const id = event.currentTarget.getAttribute("href")?.slice(1)
      if (!(id && pages[id])) return
      event.preventDefault()
      setPage(id)
    },
  }

  return (
    <div className="flex flex-col gap-6">
      <Trail {...props} items={trailTo(page)} render={<a {...navigation} />} />
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          {current.label}
        </h2>
        {current.children.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {current.children.map((child) => (
              <li key={child}>
                <a
                  href={`#${child}`}
                  {...navigation}
                  className="text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {pageOf(child).label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Pick an earlier page in the trail to go back up.
          </p>
        )}
      </section>
    </div>
  )
}

export default function TrailDemo() {
  return <TrailExample items={article} />
}
