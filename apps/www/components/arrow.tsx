import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";

export const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

export function Arrow({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full border border-current/20 transition-[rotate,background-color,color,border-color] duration-700 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-label group-hover:text-surface",
        ease,
        className,
      )}
    >
      <ArrowUpRightIcon className="size-4.5" />
    </span>
  );
}

export function Pill({ children, dark, className }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "group/pill inline-flex h-11 items-center gap-2.5 rounded-full ps-5 pe-1.5 text-[15px] font-medium tracking-[-0.01em]",
        dark ? "bg-[#1d1d1f] text-white" : "bg-white text-[#1d1d1f]",
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45",
          ease,
          dark ? "bg-white text-[#1d1d1f]" : "bg-[#1d1d1f] text-white",
        )}
      >
        <ArrowUpRightIcon weight="bold" className="size-3.5" />
      </span>
    </span>
  );
}

export function Label({ index, children, className }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs tracking-[0.02em] text-label-secondary uppercase", className)}>
      {index && `(${index}) `}
      {children}
    </p>
  );
}
