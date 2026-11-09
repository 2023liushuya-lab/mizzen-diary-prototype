// Adapted from Mizzen frontend-website/src/components/ui/input.tsx.
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}
export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-9 max-w-full min-w-0 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full resize-y rounded-md border border-border bg-card p-3 text-sm leading-7 outline-none placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-ring",
        className,
      )}
      {...props}
    />
  );
}
