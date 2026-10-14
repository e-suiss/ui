import * as React from "react";

export interface AnatomyNode {
  name: string;
  href?: string;
  children: AnatomyNode[];
}

function Tag({ node, closing, selfClosing }: { node: AnatomyNode; closing?: boolean; selfClosing?: boolean }) {
  const name = node.href ? (
    <a href={node.href} className="text-accent underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none">
      {node.name}
    </a>
  ) : (
    <span className="text-label">{node.name}</span>
  );
  return (
    <span>
      <span className="text-label-tertiary">{closing ? "</" : "<"}</span>
      {name}
      <span className="text-label-tertiary">{selfClosing ? " />" : ">"}</span>
    </span>
  );
}

function Lines({ nodes, depth }: { nodes: AnatomyNode[]; depth: number }) {
  return nodes.map((node) => {
    const pad = { paddingInlineStart: `${depth * 1.25}rem` };
    if (!node.children.length) {
      return (
        <div key={node.name} style={pad}>
          <Tag node={node} selfClosing />
        </div>
      );
    }
    return (
      <React.Fragment key={node.name}>
        <div style={pad}>
          <Tag node={node} />
        </div>
        <div className="relative">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 border-l border-label/10"
            style={{ insetInlineStart: `${depth * 1.25 + 0.3}rem` }}
          />
          <Lines nodes={node.children} depth={depth + 1} />
        </div>
        <div style={pad}>
          <Tag node={node} closing />
        </div>
      </React.Fragment>
    );
  });
}

export function Anatomy({ tree }: { tree: AnatomyNode[] }) {
  return (
    <figure data-not-prose className="mt-6 overflow-hidden rounded-3xl bg-surface-secondary">
      <figcaption className="flex items-center justify-between px-6 pt-5 font-mono text-[11px] tracking-wider text-label-tertiary uppercase">
        <span>Anatomy</span>
        <span>{count(tree)} parts</span>
      </figcaption>
      <div className="overflow-x-auto px-6 pt-4 pb-6 font-mono text-[13.5px] leading-7 whitespace-nowrap">
        <Lines nodes={tree} depth={0} />
      </div>
    </figure>
  );
}

function count(nodes: AnatomyNode[]): number {
  return nodes.reduce((total, node) => total + 1 + count(node.children), 0);
}

export function ApiPart({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl pt-6 ring-1 ring-label/10 [&>:not([data-slot=props-table])]:px-6 [&>h3]:mt-0! [&>h3]:pe-14 [&>[data-slot=props-table]]:mt-5 [&>[data-slot=props-table]]:rounded-none [&>[data-slot=props-table]]:border-t [&>[data-slot=props-table]]:border-label/10 [&>[data-slot=props-table]]:ring-0">
      <span aria-hidden className="absolute top-[1.9rem] right-6 font-mono text-[12px] leading-none text-label-tertiary">
        {String(index).padStart(2, "0")}
      </span>
      {children}
    </section>
  );
}
