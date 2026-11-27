import * as React from "react"
import { getMDXComponents } from "@/components/mdx"
import { BaseItemsProvider } from "@/components/site/base-items"
import { CompactSource } from "@/components/site/compact-source"
import { Tabs } from "@/components/site/tabs"
import { baseItems } from "@/lib/dependencies"
import { sourceVariants } from "@/lib/highlight"
import type { Variant } from "@/lib/hubs"
import { strings } from "@/lib/strings"

async function HubSource({ path }: { path: string }) {
  return <CompactSource file={path} variants={await sourceVariants(path)} />
}

const INSTALL_TABS = ["Command", "Manual"]

function manualTabs(first: { anchor: string; title: string }) {
  return function HubTabs({
    items,
    children,
  }: React.ComponentProps<typeof Tabs>) {
    if (items.join() !== INSTALL_TABS.join())
      return <Tabs items={items}>{children}</Tabs>
    const [command] = React.Children.toArray(children)
    return (
      <Tabs items={items}>
        {command}
        <p>
          {strings.hubManualLead}
          <a href={`#${first.anchor}`}>{first.title}</a>
          {strings.hubManualTail}
        </p>
      </Tabs>
    )
  }
}

function headings(anchor: string) {
  const demoted =
    (Tag: "h3" | "h4" | "h5") =>
    ({ id, ...props }: React.ComponentProps<"h2">) => (
      <Tag id={id ? `${anchor}-${id}` : undefined} {...props} />
    )
  return { h2: demoted("h3"), h3: demoted("h4"), h4: demoted("h5") }
}

export function variantTitle(title: string, hubTitle: string) {
  return title.startsWith(`${hubTitle} `)
    ? title.slice(hubTitle.length + 1)
    : title
}

async function VariantSection({
  variant,
  hubTitle,
  first,
}: {
  variant: Variant
  hubTitle: string
  first?: { anchor: string; title: string }
}) {
  const { page, anchor } = variant
  const { body: MDX } = await page.data.load()
  const name = page.slugs.at(-1) ?? anchor
  const items = await baseItems(name, () => page.data.getText("raw"))
  return (
    <section className="mt-24 first:mt-0">
      <h2 id={anchor}>{variantTitle(page.data.title, hubTitle)}</h2>
      {page.data.description && <p>{page.data.description}</p>}
      <BaseItemsProvider value={items}>
        <MDX
          components={getMDXComponents({
            ...headings(anchor),
            ComponentSource: HubSource,
            ...(first && { Tabs: manualTabs(first) }),
          })}
        />
      </BaseItemsProvider>
    </section>
  )
}

export function HubVariants({
  variants,
  hubTitle,
}: {
  variants: Variant[]
  hubTitle: string
}) {
  const [lead] = variants
  const first = lead && {
    anchor: lead.anchor,
    title: variantTitle(lead.page.data.title, hubTitle),
  }
  return variants.map((variant, index) => (
    <VariantSection
      key={variant.anchor}
      variant={variant}
      hubTitle={hubTitle}
      first={index === 0 ? undefined : first}
    />
  ))
}
