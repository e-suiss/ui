import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

import { Anchor } from "@/components/site/anchor";
import items from "@/demos/items.json";

type Item = { name: string; title: string; group: string | null };

export function RegistryIndex({ category }: { category: keyof typeof items }) {
  const list = items[category] as Item[];
  const groups = new Map<string, Item[]>();
  for (const item of list) {
    const key = item.group ?? "";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return (
    <div data-not-prose className="mt-[1.2em] flex flex-col gap-12">
      {[...groups].map(([group, members]) => (
        <section key={group || "all"} className="flex flex-col gap-4">
          {group && (
            <p className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">
              {group} · {String(members.length).padStart(2, "0")}
            </p>
          )}
          <ul className="grid border-t border-label/12 sm:grid-cols-2">
            {members.map((item) => (
              <li key={item.name} className="border-b border-label/12 sm:odd:border-e sm:odd:pe-6 sm:even:ps-6">
                <Anchor
                  href={`/docs/${category}/${item.name}`}
                  className="group flex items-center justify-between gap-4 py-3.5 text-[17px] tracking-[-0.02em] outline-none focus-visible:focus-ring"
                >
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.08,0.24,1)] group-hover:translate-x-1.5">
                    {item.title}
                  </span>
                  <ArrowUpRightIcon className="size-3.5 text-label-tertiary transition-[rotate,color] duration-500 group-hover:rotate-45 group-hover:text-label" />
                </Anchor>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
