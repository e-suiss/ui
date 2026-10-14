const kinds: Record<string, string> = {
  "React Component": "an open-source React component from suiss/ui, built on Base UI and Tailwind CSS.",
  Pattern: "an open-source React pattern from suiss/ui: components composed into a flow that adapts between desktop and mobile.",
  Interaction: "an open-source React interaction from suiss/ui, styled with Tailwind CSS.",
  Chart: "an open-source React chart from suiss/ui, built on Recharts and styled by your theme.",
  Block: "an open-source React block from suiss/ui: a complete screen built from suiss/ui components.",
};

export function pageSummary(title: string, eyebrow: string | undefined) {
  const kind = eyebrow ? kinds[eyebrow] : undefined;
  return kind ? `${title} is ${kind} The @esuiss/ui CLI copies its source into your project, so you own the code.` : undefined;
}
