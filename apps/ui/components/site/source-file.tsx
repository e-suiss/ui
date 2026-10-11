import { readFile } from "node:fs/promises";
import path from "node:path";
import { highlight } from "fumadocs-core/highlight";

import { CodeBlock } from "@/components/site/code-block";
import { SourceCode } from "@/components/site/source-code";

async function highlighted(code: string, lang: string, title?: string) {
  "use cache";
  return highlight(code.trimEnd(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    components: {
      pre: (props) => <CodeBlock {...props} title={title} raw={code.trimEnd()} />,
    },
  });
}

export function Code({ code, lang = "tsx", title }: { code: string; lang?: string; title?: string }) {
  return highlighted(code, lang, title);
}

async function highlightedFile(file: string) {
  "use cache";
  const code = await readFile(path.join(process.cwd(), "components", path.relative("components", file)), "utf8");
  return highlighted(code, path.extname(file).slice(1) || "tsx", file);
}

export async function SourceFile({ path: file, fold = true }: { path: string; fold?: boolean }) {
  const block = await highlightedFile(file);
  return fold ? <SourceCode>{block}</SourceCode> : block;
}
