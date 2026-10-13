import path from "node:path";

import { CodeBlock } from "@/components/site/code-block";
import { LazySource } from "@/components/site/lazy-source";
import { SourceCode } from "@/components/site/source-code";
import { highlightCode, readSource, sourceUrl } from "@/lib/highlight";

const PREVIEW_LINES = 16;

const languageOf = (file: string) => path.extname(file).slice(1) || "tsx";

async function highlighted(code: string, lang: string, title?: string, src?: string) {
  "use cache";
  const { className, style, html } = await highlightCode(code.trimEnd(), lang);
  return (
    <CodeBlock
      title={title}
      className={className}
      style={style}
      html={html}
      src={src}
      raw={title === "Terminal" ? code.trimEnd() : undefined}
    />
  );
}

export function Code({ code, lang = "tsx", title }: { code: string; lang?: string; title?: string }) {
  return highlighted(code, lang, title);
}

async function preview(file: string) {
  "use cache";
  const code = ((await readSource(file)) ?? "").trimEnd();
  const lines = code.split("\n");
  const long = lines.length > PREVIEW_LINES;
  const block = await highlighted(
    long ? lines.slice(0, PREVIEW_LINES).join("\n") : code,
    languageOf(file),
    file,
    long ? sourceUrl(file) : undefined,
  );
  return { block, long };
}

export async function SourceFile({ path: file, fold = true }: { path: string; fold?: boolean }) {
  const { block, long } = await preview(file);
  if (long) return <LazySource src={sourceUrl(file)} title={file}>{block}</LazySource>;
  return fold ? <SourceCode>{block}</SourceCode> : block;
}
