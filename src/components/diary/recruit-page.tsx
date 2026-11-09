"use client";
import Link from "next/link";
import { Link as LinkIcon, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { useDiaryStore } from "@/stores/diary-store";
import { records } from "@/lib/fixtures";
export function RecruitPage() {
  const t = useTranslation();
  const open = useDiaryStore((s) => s.open);
  const published = useDiaryStore((s) => s.study.published);
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 pt-16 pb-12 sm:px-6">
      <section className="space-y-4 rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium">{t("normalRecruit")}</h2>
          <Link
            href="/participant/join"
            className="text-xs text-primary hover:underline"
          >
            {t("participantPreview")}
          </Link>
        </div>
        <button
          className="flex w-full items-center justify-between rounded-xl bg-card px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900"
          onClick={() => open({ kind: "share" })}
        >
          <span className="flex items-center gap-3">
            <LinkIcon className="size-5 text-indigo-600" />
            <span>
              <strong className="block text-sm font-medium">
                {t("shareLink")}
              </strong>
              <span className="block text-xs text-muted-foreground">
                {t("shareLinkDesc")}
              </span>
            </span>
          </span>
          <Plus className="size-4 text-gray-400" />
        </button>
      </section>
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-indigo-50 p-2 text-primary">
            <Users className="size-5" />
          </span>
          <h2 className="text-sm font-medium">{t("activeRecruits")}</h2>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-gray-50 text-xs text-muted-foreground">
              <tr>
                {(
                  [
                    "recruitName",
                    "recruitType",
                    "recruitStatus",
                    "recruitCompleted",
                    "actions",
                  ] as const
                ).map((k) => (
                  <th key={k} className="px-5 py-3 font-medium">
                    {t(k)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-5 py-4 font-medium">{t("generalLink")}</td>
                <td className="px-5 py-4">{t("linkRecruit")}</td>
                <td className="px-5 py-4">
                  <Badge
                    className={
                      published
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {t(published ? "activeStatus" : "draftStatus")}
                  </Badge>
                </td>
                <td className="px-5 py-4">{records.length}</td>
                <td className="px-5 py-4">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => open({ kind: "share" })}
                  >
                    {t("previewLink")}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
