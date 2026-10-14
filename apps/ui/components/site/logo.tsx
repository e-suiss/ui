import { cn } from "cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-[24px] leading-none font-semibold tracking-[-0.03em]", className)}>suiss/ui</span>
  );
}
