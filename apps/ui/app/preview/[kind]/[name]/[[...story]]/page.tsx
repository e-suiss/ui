import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import * as React from "react";

import { PreviewCanvas } from "@/components/site/component-preview";

type Kind = "pattern" | "interaction" | "block";

const folders: Record<Kind, string> = { pattern: "patterns", interaction: "interactions", block: "blocks" };

const scrollbars = `
html, body { overflow: hidden; }
* { scrollbar-width: thin; scrollbar-color: color-mix(in oklab, var(--color-label) 22%, transparent) transparent; }
*::-webkit-scrollbar { width: 9px; height: 9px; }
*::-webkit-scrollbar-track, *::-webkit-scrollbar-corner { background: transparent; }
*::-webkit-scrollbar-thumb { border: 2px solid transparent; border-radius: 9999px; background: color-mix(in oklab, var(--color-label) 22%, transparent) padding-box; }
*::-webkit-scrollbar-thumb:hover { background-color: color-mix(in oklab, var(--color-label) 35%, transparent); }
`;

export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams(): { kind: string; name: string; story: string[] }[] {
  return (Object.keys(folders) as Kind[]).flatMap((kind) => {
    const dir = path.join(process.cwd(), "demos", "api", folders[kind]);
    return readdirSync(dir).flatMap((file): { kind: string; name: string; story: string[] }[] => {
      const name = file.replace(/\.json$/, "");
      if (kind === "block") return [{ kind, name, story: [] }];
      const api = JSON.parse(readFileSync(path.join(dir, file), "utf8")) as { examples: string[] };
      return api.examples.map((story) => ({ kind, name, story: [story] }));
    });
  });
}

async function Canvas({ params }: { params: PageProps<"/preview/[kind]/[name]/[[...story]]">["params"] }) {
  const { kind, name, story } = await params;
  return <PreviewCanvas kind={kind as Kind} name={name} story={story?.[0]} />;
}

export default function Preview(props: PageProps<"/preview/[kind]/[name]/[[...story]]">) {
  return (
    <>
      <style>{scrollbars}</style>
      <React.Suspense>
        <Canvas params={props.params} />
      </React.Suspense>
    </>
  );
}
