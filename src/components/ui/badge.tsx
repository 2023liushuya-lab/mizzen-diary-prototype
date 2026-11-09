import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-surface px-2 py-0.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
