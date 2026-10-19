import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Board01, Board02 } from "@/components/create/boards"
import { CreateFrame } from "@/components/create/frame"
import { ItemView } from "@/components/create/item-view"
import { BOARDS } from "@/lib/create/boards"
import { createGroups, createItem } from "@/lib/create/items"

export const metadata: Metadata = { robots: { index: false } }

export async function generateStaticParams() {
  const groups = await createGroups()
  return [
    ...BOARDS.map(({ name }) => ({ item: name })),
    ...groups.flatMap((group) =>
      group.items.map((item) => ({ item: item.name }))
    ),
  ]
}

async function Content({ name }: { name: string }) {
  if (name === "preview-01") return <Board01 />
  if (name === "preview-02") return <Board02 />
  const found = await createItem(name)
  if (!found) notFound()
  return <ItemView group={found.group} item={found.item} />
}

export default async function Page(props: PageProps<"/preview/create/[item]">) {
  const { item } = await props.params
  return (
    <CreateFrame>
      <Content name={item} />
    </CreateFrame>
  )
}
