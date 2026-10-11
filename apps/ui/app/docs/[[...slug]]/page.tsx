import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import { findNeighbour } from "fumadocs-core/page-tree";
import type { Metadata } from "next";
import * as React from "react";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/components/mdx";
import { Anchor } from "@/components/site/anchor";
import { PageActions } from "@/components/site/page-actions";
import { Toc } from "@/components/site/toc";
import { source } from "@/lib/source";
import { strings } from "@/lib/strings";

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

function getDocPage(params: { slug?: string[] }) {
  return source.getPage(params.slug);
}

function Neighbour({
  direction,
  href,
  name,
}: {
  direction: "previous" | "next";
  href: string;
  name: React.ReactNode;
}) {
  const next = direction === "next";
  const Icon = next ? ArrowRightIcon : ArrowLeftIcon;

  return (
    <Anchor
      href={href}
      className={cn(
        "group flex items-center justify-between gap-6 border-t border-label/12 py-6 outline-none focus-visible:focus-ring md:py-8",
        !next && "flex-row-reverse",
      )}
    >
      <span className={cn("flex flex-col gap-2", !next && "items-end text-end")}>
        <span className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">
          {next ? strings.next : strings.previous}
        </span>
        <span
          className={cn(
            "text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-semibold tracking-[-0.045em] transition-transform duration-700",
            next ? "group-hover:translate-x-2" : "group-hover:-translate-x-2",
            ease,
          )}
        >
          {name}
        </span>
      </span>
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full border border-label/15 transition-colors duration-500 group-hover:border-transparent group-hover:bg-label group-hover:text-surface",
          ease,
        )}
      >
        <Icon className="size-4" />
      </span>
    </Anchor>
  );
}

function PageSkeleton() {
  return (
    <div className="flex gap-12 px-5 pt-14 pb-24 md:px-10 md:pt-20 xl:pe-10">
      <div className="mx-auto flex w-full max-w-205 min-w-0 animate-pulse flex-col gap-5">
        <div className="h-3 w-32 rounded-full bg-label/8" />
        <div className="h-16 w-2/3 rounded-2xl bg-label/8" />
        <div className="h-5 w-full max-w-xl rounded-full bg-label/6" />
        <div className="mt-12 h-72 rounded-[24px] bg-label/5" />
      </div>
      <div className="hidden w-52 shrink-0 xl:block" />
    </div>
  );
}

export default function Page(props: PageProps<"/docs/[[...slug]]">) {
  return (
    <React.Suspense fallback={<PageSkeleton />}>
      <DocPage params={props.params} />
    </React.Suspense>
  );
}

async function DocPage(props: { params: PageProps<"/docs/[[...slug]]">["params"] }) {
  const params = await props.params;
  const page = getDocPage(params);
  if (!page) notFound();

  const eyebrow = page.data.eyebrow;
  const kind = eyebrow && eyebrow !== strings.brand ? eyebrow : undefined;
  const { body: MDX, toc } = await page.data.load();
  const wide = /^\/docs\/(patterns|interactions|blocks)(\/|$)/.test(page.url);
  const { previous, next } = findNeighbour(source.getPageTree(), page.url, {
    separateRoot: true,
  });

  return (
    <div className="flex gap-12 px-5 pt-14 pb-24 md:px-10 md:pt-20 xl:pe-10">
      <article className={cn("mx-auto w-full min-w-0", wide ? "max-w-[72rem]" : "max-w-205")}>
        <header className="mb-14 flex flex-col gap-5 md:mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">
              {strings.brand}
              {kind && <span className="text-label-tertiary"> · {kind}</span>}
            </p>
            <PageActions markdownUrl={`/llms.mdx${page.url}`} />
          </div>
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.055em] text-balance">
            {page.data.title}
          </h1>
          {page.data.description && (
            <p className="max-w-2xl text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.38] tracking-[-0.02em] text-pretty text-label-secondary">
              {page.data.description}
            </p>
          )}
        </header>
        <div className="prose">
          <MDX components={getMDXComponents()} />
        </div>
        {(previous || next) && (
          <nav aria-label="Pagination" className="mt-24 border-b border-label/12">
            {next && <Neighbour direction="next" href={next.url} name={next.name} />}
            {previous && <Neighbour direction="previous" href={previous.url} name={previous.name} />}
          </nav>
        )}
      </article>
      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
        <Toc items={toc} />
      </aside>
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const page = getDocPage(await props.params);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
