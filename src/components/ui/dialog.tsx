"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  closeLabel: string;
}) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/30" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[560px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 outline-none">
          <div className="mb-5 flex items-center justify-between gap-4">
            <DialogPrimitive.Title className="text-xl font-semibold">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label={closeLabel}>
                <X />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description
            className={
              description ? "mb-5 text-sm text-muted-foreground" : "sr-only"
            }
          >
            {description || title}
          </DialogPrimitive.Description>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
