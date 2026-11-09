"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  ChevronRight,
  MessageSquare,
  Moon,
  Sun,
  ArrowRight,
  Languages,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDiaryStore } from "@/stores/diary-store";
import { useTranslation } from "@/hooks/use-translation";
import type { Key } from "@/i18n/messages";
import { cn } from "@/lib/utils";
export function Brand() {
  return (
    <Image
      src="/mizzen-demo-logo.png"
      width={32}
      height={32}
      alt="Mizzen"
      unoptimized
      priority
      className="size-8 rounded-[5px]"
    />
  );
}
export function Preferences() {
  const theme = useDiaryStore((s) => s.theme);
  const toggle = useDiaryStore((s) => s.toggleTheme);
  const locale = useDiaryStore((s) => s.locale);
  const setLocale = useDiaryStore((s) => s.setLocale);
  const t = useTranslation();
  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="size-7 [&_svg]:size-3.5"
        aria-label={t(theme === "light" ? "dark" : "light")}
        onClick={toggle}
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 [&_svg]:size-3.5"
        aria-label={t("switchLanguage")}
        onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      >
        <Languages />
      </Button>
    </div>
  );
}
export function Footer() {
  const t = useTranslation();
  const open = useDiaryStore((s) => s.open);
  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 flex h-7 items-center justify-between gap-3 border-t border-border bg-card px-4 text-[10px] text-muted-foreground">
      <span className="truncate">{t("demoFooter")}</span>
      <div className="flex shrink-0 items-center gap-3">
        <Preferences />
        <a
          href="https://mizzen-ai.feishu.cn/wiki/SL6mwLLTriJjDDkFdPLcbxyDntd"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline"
        >
          {t("sourcePRD")}
        </a>
        <button onClick={() => open({ kind: "notes" })}>{t("notes")}</button>
      </div>
    </footer>
  );
}
const tabs: [string, Key][] = [
  ["/study/outline", "create"],
  ["/study/recruit", "recruit"],
  ["/study/records", "records"],
  ["/study/analysis", "analysis"],
];
export function StudyShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const title = useDiaryStore((s) => s.study.title);
  const dirty = useDiaryStore((s) => s.study.dirty);
  const savedAt = useDiaryStore((s) => s.study.savedAt);
  const open = useDiaryStore((s) => s.open);
  const t = useTranslation();
  const editing = path === "/study/outline";
  return (
    <>
      <header className="relative z-20 grid min-h-12 grid-cols-[1fr_auto] items-center gap-3 border-b border-border bg-card pr-3 pl-6 lg:h-12 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" aria-label={t("back")}>
            <Brand />
          </Link>
          <div className="h-6 w-px bg-indigo-100" />
          <span
            className="max-w-[220px] truncate text-sm font-medium xl:max-w-[430px]"
            title={title}
          >
            {title}
          </span>
          {editing && (
            <Badge className="hidden bg-surface text-muted-foreground xl:inline-flex">
              {t("diary")}
            </Badge>
          )}
        </div>
        <nav
          aria-label={t("flow")}
          className="col-span-2 flex h-10 items-center justify-center gap-2 lg:col-span-1 lg:h-12"
        >
          {tabs.map(([url, key], i) => (
            <div className="flex items-center gap-2" key={url}>
              {i > 0 && <ChevronRight className="size-4 text-gray-300" />}
              <Link
                className={cn(
                  "px-2 text-sm font-medium transition-colors",
                  path === url
                    ? "text-foreground"
                    : "text-placeholder hover:text-foreground",
                )}
                href={url}
              >
                {t(key)}
              </Link>
            </div>
          ))}
        </nav>
        <div className="col-start-2 row-start-1 flex items-center justify-end gap-3 lg:col-start-3">
          {editing && (
            <span
              className={cn(
                "hidden items-center gap-1 text-xs sm:flex",
                dirty ? "text-muted-foreground" : "text-green-600",
              )}
            >
              <Check className="size-3.5" />
              {t(dirty ? "dirty" : savedAt ? "savedState" : "localDraft")}
            </span>
          )}
          <Button
            variant="outline"
            className="h-8 rounded-lg px-3 text-xs"
            onClick={() => open({ kind: "share" })}
          >
            <Share2 />
            {t("inviteLabel")}
          </Button>
          {editing && (
            <Button
              className="h-9 rounded-[10px]"
              onClick={() => open({ kind: "publish" })}
            >
              <ArrowRight />
              {t("publish")}
            </Button>
          )}
        </div>
      </header>
      <main className="mb-7 min-h-[calc(100dvh-76px)]">{children}</main>
      <Footer />
    </>
  );
}
export function EditorRail() {
  const t = useTranslation();
  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-3 border-r border-border bg-surface pt-3">
      <Button
        variant="ghost"
        size="icon"
        title={t("chat")}
        onClick={() => useDiaryStore.getState().notify("sampleLoaded")}
      >
        <MessageSquare />
      </Button>
      <span className="my-1 h-px w-6 bg-border" />
      <span className="text-[10px] text-muted-foreground">{t("settings")}</span>
    </div>
  );
}
