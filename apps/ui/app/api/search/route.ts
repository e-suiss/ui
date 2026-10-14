import type { Node } from "fumadocs-core/page-tree";

import { source } from "@/lib/source";

type Entry = { title: string; description?: string; url: string };

function pagesOf(nodes: Node[]): string[] {
  return nodes.flatMap((node) => {
    if (node.type === "page") return [node.url];
    if (node.type === "folder") return [...(node.index ? [node.index.url] : []), ...pagesOf(node.children)];
    return [];
  });
}

export function GET() {
  const pages = new Map(source.getPages().map((page) => [page.url, page.data]));
  const entry = (url: string): Entry[] => {
    const data = pages.get(url);
    return data ? [{ title: data.title ?? url, description: data.description, url }] : [];
  };
  const groups: { name: string; pages: Entry[] }[] = [];
  let current: { name: string; pages: Entry[] } | undefined;

  for (const node of source.getPageTree().children) {
    if (node.type === "separator") {
      current = { name: String(node.name ?? ""), pages: [] };
      groups.push(current);
    } else if (node.type === "folder") {
      groups.push({ name: String(node.name), pages: pagesOf([node]).flatMap(entry) });
      current = undefined;
    } else {
      if (!current) {
        current = { name: "", pages: [] };
        groups.push(current);
      }
      current.pages.push(...entry(node.url));
    }
  }

  return Response.json(groups.filter((group) => group.pages.length > 0));
}
