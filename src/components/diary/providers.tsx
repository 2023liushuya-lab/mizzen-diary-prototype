"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useDiaryStore } from "@/stores/diary-store";
import { useTranslation } from "@/hooks/use-translation";
import { ModalHost } from "./modal-host";
export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const theme = useDiaryStore((s) => s.theme);
  const locale = useDiaryStore((s) => s.locale);
  const toast = useDiaryStore((s) => s.toast);
  const notify = useDiaryStore((s) => s.notify);
  const t = useTranslation();
  useEffect(() => {
    let alive = true;
    Promise.resolve(useDiaryStore.persist.rehydrate()).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [theme, locale]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => notify(null), 4000);
    return () => clearTimeout(timer);
  }, [toast, notify]);
  return (
    <>
      {ready ? (
        children
      ) : (
        <div className="p-8 text-sm text-muted-foreground" role="status">
          {t("loading")}
        </div>
      )}
      <ModalHost />
      {toast && (
        <div
          role="status"
          className="fixed bottom-14 left-1/2 z-[60] max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-xl bg-foreground px-5 py-3 text-sm text-card"
        >
          {t(toast)}
        </div>
      )}
    </>
  );
}
