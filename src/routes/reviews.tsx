import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { notify, announce } from "@/lib/announce";
import { CheckCircle2, GitMerge, MessageSquare, RotateCcw, ThumbsDown } from "lucide-react";
import { PageHeader, DemoBadge, EmptyState } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { actions, useAppState } from "@/lib/store";
import { formatTime, reviewBlockReason, statusLabel, type ReviewStatus } from "@/lib/model";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [
    { title: "Review Queue — The Yard Studio" },
    { name: "description", content: "Comment, approve, request changes, and simulate design merges." },
  ] }),
  component: Reviews,
});

const STATES: { id: "all" | ReviewStatus; label: string }[] = [
  { id: "all", label: "All" }, { id: "open", label: "Awaiting review" },
  { id: "changes", label: "Changes requested" }, { id: "approved", label: "Approved" }, { id: "merged", label: "Merged" },
];
function Reviews() {
  const { reviews, projects, role } = useAppState();
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const filtered = reviews.filter((r) => filter === "all" || r.status === filter);
  const active = reviews.find((r) => r.id === activeId) ?? null;
  const open = (id: string) => {
    setActiveId(id);
    setComment("");
    if (id === "husa-header") actions.markHusaOpened();
    const r = reviews.find((x) => x.id === id);
    if (r) announce(`Opened review: ${r.title}`);
  };
  const submitComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!active) return;
    if (!comment.trim()) { notify.error("Write feedback before posting"); return; }
    actions.commentReview(active.id, comment);
    setComment("");
    notify.success("Feedback saved locally");
  };
  const transition = (to: ReviewStatus) => {
    if (!active) return;
    const error = actions.transitionReview(active.id, to);
    if (error) notify.error(error);
    else notify.success("Review moved to " + statusLabel[to] + " (local demo)");
  };
  const may = (to: ReviewStatus) => active !== null && reviewBlockReason(role, active.status, to) === null;

  return (
    <div className="mx-auto max-w-7xl min-w-0">
      <PageHeader eyebrow="Review with intention" title="Review Queue">
        Discuss design updates and practice an approval workflow. <strong>Review branches and merges here are simulated local records, not GitHub pull requests.</strong>
      </PageHeader>
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-md border bg-cream p-4">
        <MessageSquare className="h-5 w-5 text-cardinal" aria-hidden />
        <p className="text-sm">Current demo role: <strong>{role}</strong>. Switch roles from My Bison Card or the sidebar to test permissions.</p>
        <Button variant="outline" size="sm" asChild><Link to="/profile">Change role</Link></Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(250px,0.78fr)_minmax(0,1.4fr)]">
        <section className="min-w-0" aria-labelledby="review-list">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="review-list" className="font-display text-3xl text-navy">Requests</h2>
            <DemoBadge>{reviews.length} total</DemoBadge>
          </div>
          <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter review status">
            {STATES.map((s) => <button type="button" key={s.id} aria-pressed={filter === s.id}
              className={"min-h-9 rounded-full border px-3 text-xs font-semibold " + (filter === s.id ? "bg-navy text-paper" : "bg-card hover:bg-cream")}
              onClick={() => { setFilter(s.id); setActiveId(null); }}>{s.label}</button>)}
          </div>
          <ul className="space-y-3">
            {filtered.map((r) => <li key={r.id}>
              <button type="button" onClick={() => open(r.id)} aria-pressed={activeId === r.id}
                className={"w-full min-w-0 rounded-md border-2 p-4 text-left hover:bg-cream " + (activeId === r.id ? "border-cardinal bg-cream" : "border-border bg-card")}>
                <span className="flex flex-wrap justify-between gap-2"><span className="eyebrow text-cardinal">{r.sample ? "Sample request" : "Local request"}</span><span className="text-xs text-muted-foreground">{statusLabel[r.status]}</span></span>
                <span className="font-display mt-3 block break-words text-2xl leading-tight text-navy">{r.title}</span>
                <span className="mt-2 block text-xs text-muted-foreground">{r.comments.length} comments · {r.history.length} events</span>
              </button>
            </li>)}
          </ul>
          {!filtered.length && <EmptyState title="No reviews here">Select another status or submit a design from the editor.</EmptyState>}
          <p className="mt-4 text-sm text-muted-foreground">Need a review? Open a project in the <Link className="text-cardinal underline" to="/editor">Design Editor</Link> and select “Submit for review.”</p>
        </section>
        <section className="min-w-0 rounded-md border-2 border-ink bg-card p-5" aria-label="Review details">
          {active ? (
            <>
              <div className="flex flex-wrap justify-between gap-2"><DemoBadge>{statusLabel[active.status]}</DemoBadge><span className="eyebrow text-muted-foreground">Local simulation</span></div>
              <h2 className="font-display mt-4 break-words text-3xl leading-tight text-navy sm:text-4xl">{active.title}</h2>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed">{active.summary}</p>
              {projects.find((p) => p.id === active.projectId) && <Button variant="outline" size="sm" className="mt-4" asChild><Link to="/editor" search={{ id: active.projectId }}>Open source design</Link></Button>}
              <div className="mt-6 border-t pt-5">
                <h3 className="font-display text-2xl text-navy">Review decisions</h3>
                <p className="mb-3 mt-1 text-sm text-muted-foreground">Reviewer/Lead can approve or request changes. Only Lead can merge an approved review. Status stays in this browser.</p>
                <div className="flex flex-wrap gap-2">
                  {active.status === "open" && <>
                    <Button size="sm" variant="cardinal" disabled={!may("approved")} title={reviewBlockReason(role, active.status, "approved") ?? undefined} onClick={() => transition("approved")}><CheckCircle2 aria-hidden /> Approve</Button>
                    <Button size="sm" variant="outline" disabled={!may("changes")} title={reviewBlockReason(role, active.status, "changes") ?? undefined} onClick={() => transition("changes")}><ThumbsDown aria-hidden /> Request changes</Button>
                  </>}
                  {active.status === "approved" && <>
                    <Button size="sm" variant="cardinal" disabled={!may("merged")} title={reviewBlockReason(role, active.status, "merged") ?? undefined} onClick={() => transition("merged")}><GitMerge aria-hidden /> Simulate merge</Button>
                    <Button size="sm" variant="outline" disabled={!may("changes")} onClick={() => transition("changes")}>Request changes</Button>
                  </>}
                  {active.status === "changes" && <Button size="sm" variant="cardinal" disabled={!may("open")} onClick={() => transition("open")}><RotateCcw aria-hidden /> Resubmit for review</Button>}
                  {active.status === "merged" && <p className="rounded-md bg-cream p-3 text-sm">This concept review is complete. The merge exists only in the local demo history.</p>}
                </div>
              </div>
              <div className="mt-6 border-t pt-5">
                <h3 className="font-display text-2xl text-navy">Feedback ({active.comments.length})</h3>
                <ol className="mt-3 space-y-3">
                  {active.comments.map((c) => <li key={c.id} className="rounded-md bg-cream p-3">
                    <p className="flex flex-wrap justify-between gap-2 text-xs font-semibold"><span>{c.author} · {c.role}{c.sample ? " · sample" : ""}</span><time className="text-muted-foreground">{formatTime(c.at)}</time></p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm">{c.body}</p>
                  </li>)}
                  {!active.comments.length && <li className="text-sm text-muted-foreground">No feedback yet.</li>}
                </ol>
                <form onSubmit={submitComment} className="mt-5 space-y-2">
                  <Label htmlFor="review-comment">Leave constructive feedback</Label>
                  <textarea id="review-comment" rows={3} maxLength={1000} className="w-full rounded-md border bg-background p-3 text-sm" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What works well? What would you change?" />
                  <Button type="submit" variant="cardinal">Post feedback locally</Button>
                </form>
              </div>
              <div className="mt-6 border-t pt-5">
                <h3 className="font-display text-2xl text-navy">Decision history</h3>
                <ol className="mt-3 space-y-2 text-sm">{active.history.map((h, i) => <li className="break-words border-l-2 border-cardinal pl-3" key={i}><strong>{statusLabel[h.to]}</strong> by {h.by} · {formatTime(h.at)}</li>)}</ol>
              </div>
            </>
          ) : <EmptyState title="Choose a review">Open a request from the left to see its comments, decisions, and history.</EmptyState>}
        </section>
      </div>
    </div>
  );
}
