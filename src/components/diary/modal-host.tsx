"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDiaryStore } from "@/stores/diary-store";
import { useTranslation } from "@/hooks/use-translation";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { initialStudy, records } from "@/lib/fixtures";
import { visibleQuestions, formatDuration } from "@/lib/diary-rules";
import type { Key } from "@/i18n/messages";
export function ModalHost() {
  const modal = useDiaryStore((s) => s.modal);
  const open = useDiaryStore((s) => s.open);
  const study = useDiaryStore((s) => s.study);
  const publish = useDiaryStore((s) => s.publish);
  const importQuestions = useDiaryStore((s) => s.importQuestions);
  const notify = useDiaryStore((s) => s.notify);
  const [order, setOrder] = useState(1);
  const [text, setText] = useState("");
  const t = useTranslation();
  const router = useRouter();
  if (!modal) return null;
  const close = () => open(null);
  const notice = "rounded-xl bg-surface p-4 text-sm leading-7";
  const muted = "text-xs leading-6 text-muted-foreground";
  const footer = (primary: string, action: () => void) => (
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="outline" onClick={close}>
        {t("cancel")}
      </Button>
      <Button onClick={action}>{primary}</Button>
    </div>
  );
  const titles: Record<NonNullable<typeof modal>["kind"], Key> = {
    publish: "publishTitle",
    share: "shareTitle",
    remind: "remind",
    preview: "preview",
    import: "importOutline",
    notes: "notes",
    column: "aiColumn",
    record: "viewReply",
  };
  const record =
    modal.kind === "record" ? records.find((r) => r.id === modal.id) : null;
  return (
    <Dialog
      open
      onClose={close}
      title={
        record
          ? `${record.id} · ${record.participantId} ${record.name}`
          : t(titles[modal.kind])
      }
      closeLabel={t("close")}
    >
      {modal.kind === "publish" && (
        <>
          <p className="mb-4 font-medium">{study.title}</p>
          <div className={notice}>
            <p>
              {study.config.start} — {study.config.end}
            </p>
            <p>{t("publishHint")}</p>
          </div>
          <p className={"mt-4 " + muted}>{t("publishDemo")}</p>
          {footer(t("confirmPublish"), () => {
            if (publish()) {
              close();
              router.push("/study/recruit");
            }
          })}
        </>
      )}
      {modal.kind === "share" && (
        <>
          <p className="mb-4">{t("shareHint")}</p>
          <label className="mb-2 block text-sm" htmlFor="share-link">
            {t("interviewLink")}
          </label>
          <Input
            id="share-link"
            value="https://test.mizzen.top/interview/diary-demo"
            readOnly
          />
          <p className={"mt-4 " + notice}>{t("sampleLink")}</p>
          {footer(t("viewRecords"), () => {
            close();
            router.push("/study/records");
          })}
        </>
      )}
      {modal.kind === "remind" && (
        <>
          <p className="mb-4">{t("remindHint")}</p>
          <div className={notice}>{t("pendingParticipant")}</div>
          <p className={"mt-4 " + muted}>{t("remindDemo")}</p>
          {footer(t("confirmRemind"), () => {
            close();
            notify("reminded");
          })}
        </>
      )}
      {modal.kind === "preview" && (
        <>
          <label htmlFor="preview-order" className="mb-2 block font-medium">
            {t("previewOrder")}
          </label>
          <Input
            id="preview-order"
            type="number"
            min={1}
            max={999}
            value={order}
            onChange={(e) => setOrder(Math.max(1, Number(e.target.value)))}
          />
          <div className="my-5 space-y-4" data-testid="preview-questions">
            {visibleQuestions(study.questions, order).map((q) => (
              <div className="border-t border-border pt-4" key={q.id}>
                <div className="flex gap-2">
                  <Badge className="bg-accent text-primary">{q.id}</Badge>
                  <strong className="text-sm">{q.title}</strong>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{q.prompt}</p>
              </div>
            ))}
            {visibleQuestions(study.questions, order).length === 0 && (
              <p>{t("noQuestions")}</p>
            )}
          </div>
          <p className={muted}>{t("previewHint")}</p>
        </>
      )}
      {modal.kind === "import" && (
        <>
          <p className="mb-4">{t("importHint")}</p>
          <Textarea
            aria-label={t("importText")}
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className={"mt-3 " + muted}>{t("importDemo")}</p>
          {footer(t("confirmImport"), () => {
            if (importQuestions(text)) {
              setText("");
              router.push("/study/outline");
            }
          })}
        </>
      )}
      {modal.kind === "column" && (
        <>
          <label htmlFor="column-prompt" className="mb-3 block font-medium">
            {t("columnPrompt")}
          </label>
          <Textarea id="column-prompt" rows={3} />
          <p className={"mt-4 " + notice}>{t("columnHint")}</p>
        </>
      )}
      {modal.kind === "notes" && (
        <div className="space-y-4 text-sm leading-7">
          <p>{t("noteBody")}</p>
          <p className="text-muted-foreground">{t("noteDesign")}</p>
          <a
            className="text-primary hover:underline"
            href="https://mizzen-ai.feishu.cn/wiki/SL6mwLLTriJjDDkFdPLcbxyDntd"
            target="_blank"
            rel="noreferrer"
          >
            {t("sourcePRD")}
          </a>
        </div>
      )}
      {modal.kind === "record" && record && (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-accent text-primary">
              {t("order", { n: record.order })}
            </Badge>
            {record.tags.map((tag) => (
              <Badge key={tag}>#{tag}</Badge>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {record.startedAt} · {formatDuration(record.duration)} ·{" "}
            {t("replyQuality")}{" "}
            {t(record.quality === "high" ? "high" : "medium")}
          </p>
          <h3 className="mt-6 mb-3 font-semibold">{t("sessionSummary")}</h3>
          <p className={notice}>{record.summary ?? t("noSessionSummary")}</p>
          <h3 className="mt-6 mb-3 font-semibold">{t("originalAnswer")}</h3>
          {[...record.answers]
            .sort(
              (a, b) =>
                Number(b.questionId === modal.questionId) -
                Number(a.questionId === modal.questionId),
            )
            .map((answer) => (
              <section
                key={answer.questionId}
                className={
                  "border-b border-border py-4 " +
                  (modal.questionId === answer.questionId
                    ? "rounded-md bg-indigo-50/50 px-3"
                    : "")
                }
                data-testid="answer-detail"
                data-question={answer.questionId}
              >
                <h4 className="mb-2 text-sm font-medium">
                  {answer.questionId} ·{" "}
                  {
                    initialStudy.questions.find(
                      (q) => q.id === answer.questionId,
                    )?.title
                  }
                </h4>
                <p className="text-sm leading-7 text-muted-foreground">
                  {answer.text}
                </p>
              </section>
            ))}
          <p className={"mt-3 " + muted}>{t("demoTranscript")}</p>
          <h3 className="mt-6 mb-2 font-semibold">{t("sameParticipant")}</h3>
          {records
            .filter((r) => r.participantId === record.participantId)
            .map((r) => (
              <div key={r.id} className="border-b border-border py-3">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => open({ kind: "record", id: r.id })}
                >
                  {t("order", { n: r.order })} · {r.id} · {r.startedAt}
                </button>
              </div>
            ))}
        </>
      )}
    </Dialog>
  );
}
