import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MessageCircle, Plus, Search, Send } from "lucide-react";
import { PageHeader, DemoBadge, EmptyState } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actions, useAppState } from "@/lib/store";
import { formatTime } from "@/lib/model";

export const Route = createFileRoute("/lounge")({
  head: () => ({ meta: [
    { title: "Blackburn Lounge — The Yard Studio" },
    { name: "description", content: "Discuss, review, and share ideas for campus design concepts." },
  ] }),
  component: Lounge,
});

function Lounge() {
  const { threads } = useAppState();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const filtered = threads.filter((t) => (t.title + " " + t.body).toLowerCase().includes(query.trim().toLowerCase()));
  const active = threads.find((t) => t.id === activeId) ?? filtered[0] ?? null;

  const post = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim().length < 5 || body.trim().length < 10) {
      setError("Add a title of at least 5 characters and a message of at least 10.");
      return;
    }
    actions.addThread(title, body);
    setTitle("");
    setBody("");
    setActiveId(null);
    setNewOpen(false);
    setQuery("");
    setError("");
    toast.success("Discussion saved in this browser");
  };
  const comment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!active) return;
    if (!reply.trim()) { toast.error("Write a reply before posting"); return; }
    actions.commentThread(active.id, reply);
    setReply("");
    toast.success("Reply added locally");
  };

  return (
    <div className="mx-auto max-w-7xl min-w-0">
      <PageHeader eyebrow="Campus design conversations" title="Blackburn Lounge" actions={
        <Button variant="cardinal" onClick={() => { setNewOpen((v) => !v); setError(""); }}><Plus aria-hidden /> {newOpen ? "Close composer" : "Start discussion"}</Button>
      }>
        Exchange design ideas, give feedback, and explore conversations. These are local demo threads, not messages sent to other students.
      </PageHeader>
      {newOpen && (
        <section className="mb-7 rounded-md border-2 border-ink bg-cream p-5" aria-labelledby="start-thread">
          <h2 id="start-thread" className="font-display text-3xl text-navy">Start a conversation</h2>
          <form className="mt-4 space-y-3" onSubmit={post} noValidate>
            <div><Label htmlFor="thread-title">Discussion title</Label><Input id="thread-title" value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} placeholder="What are you designing?" /></div>
            <div><Label htmlFor="thread-body">Your idea or question</Label><textarea id="thread-body" rows={4} maxLength={1200} className="w-full rounded-md border bg-card px-3 py-2 text-sm" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share the context and what feedback you're looking for" /></div>
            {error && <p className="text-sm text-cardinal" role="alert">{error}</p>}
            <Button type="submit" variant="cardinal"><Send aria-hidden /> Post discussion locally</Button>
          </form>
        </section>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(250px,0.75fr)_minmax(0,1.3fr)]">
        <section className="min-w-0" aria-labelledby="thread-list">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><h2 id="thread-list" className="font-display text-3xl text-navy">Conversations</h2><p className="eyebrow text-muted-foreground">{threads.length} threads</p></div>
          <div className="relative mb-3"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden /><Input className="pl-9" value={query} onChange={(e) => { setQuery(e.target.value); setActiveId(null); }} placeholder="Search conversations" aria-label="Search conversations" /></div>
          <ul className="space-y-3">
            {filtered.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => { setActiveId(t.id); setReply(""); }} aria-pressed={active?.id === t.id} className={"w-full min-w-0 rounded-md border-2 p-4 text-left transition-colors hover:bg-cream " + (active?.id === t.id ? "border-cardinal bg-cream" : "border-border bg-card")}>
                  <span className="flex flex-wrap items-center justify-between gap-2"><span className="eyebrow text-cardinal">{t.sample ? "Sample discussion" : "Local discussion"}</span><span className="text-xs text-muted-foreground">{t.comments.length} replies</span></span>
                  <span className="mt-2 block break-words font-display text-xl leading-tight text-navy">{t.title}</span>
                  <span className="mt-2 block text-xs text-muted-foreground">{t.author} · {formatTime(t.at)}</span>
                </button>
              </li>
            ))}
          </ul>
          {!filtered.length && <EmptyState title="No discussions found">Try a different search or start a conversation.</EmptyState>}
        </section>
        <section className="min-w-0 rounded-md border-2 border-ink bg-card p-5" aria-label="Selected conversation">
          {active ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2"><DemoBadge>{active.sample ? "Sample thread" : "Saved locally"}</DemoBadge><MessageCircle className="h-5 w-5 text-cardinal" aria-hidden /></div>
              <h2 className="font-display mt-4 break-words text-3xl leading-tight text-navy sm:text-4xl">{active.title}</h2>
              <p className="mt-2 text-xs text-muted-foreground">{active.author} · {formatTime(active.at)}</p>
              <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-relaxed">{active.body}</p>
              <div className="my-6 border-t" />
              <h3 className="font-display text-2xl text-navy">Replies ({active.comments.length})</h3>
              <ol className="mt-4 space-y-3">
                {active.comments.map((c) => <li key={c.id} className="min-w-0 rounded-md bg-cream p-4">
                  <p className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold"><span>{c.author}{c.sample ? " · sample" : ""}</span><time className="text-muted-foreground">{formatTime(c.at)}</time></p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm">{c.body}</p>
                </li>)}
                {!active.comments.length && <li className="text-sm text-muted-foreground">No replies yet. Add the first one.</li>}
              </ol>
              <form className="mt-6 space-y-2 border-t pt-5" onSubmit={comment}>
                <Label htmlFor="thread-reply">Add a reply</Label>
                <textarea id="thread-reply" rows={3} maxLength={1000} className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Share constructive feedback" />
                <Button type="submit" variant="cardinal"><Send aria-hidden /> Reply locally</Button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">Posts stay in this browser. No account or live messaging service is connected.</p>
            </>
          ) : <EmptyState title="Select a conversation">Choose a discussion from the list to read and reply.</EmptyState>}
        </section>
      </div>
    </div>
  );
}
