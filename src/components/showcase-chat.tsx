import { useState, type FormEvent } from "react";
import { Send, MessagesSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState, actions } from "@/lib/store";
import { formatTime } from "@/lib/model";

function initials(name: string) {
  return name.split(" ").map((part) => part.slice(0, 1)).join("").replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "Y";
}

/** Persistent browser-local mock group chats; no backend, notifications, or delivery. */
export function ShowcaseChat() {
  const { chats } = useAppState();
  const [selected, setSelected] = useState("general");
  const [draft, setDraft] = useState("");
  const room = chats.find((c) => c.id === selected) ?? chats[0];

  function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!room || !draft.trim()) return;
    actions.postChat(room.id, draft);
    setDraft("");
  }

  return (
    <section className="mb-10 min-w-0 overflow-hidden rounded-md border-2 border-ink bg-card" aria-labelledby="chat-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-navy p-5 text-paper">
        <div className="min-w-0">
          <p className="eyebrow text-paper/70">A glimpse inside student collaboration</p>
          <h2 id="chat-heading" className="font-display mt-1 break-words text-3xl sm:text-4xl">Group chats</h2>
        </div>
        <span className="rounded-full border border-paper/40 px-3 py-1 text-xs font-semibold">Fictional example conversations</span>
      </div>
      <div className="grid min-w-0 lg:grid-cols-[250px_minmax(0,1fr)]">
        <nav className="min-w-0 border-b bg-cream p-3 lg:border-b-0 lg:border-r" aria-label="Sample chat rooms">
          <p className="eyebrow mb-3 px-2 text-muted-foreground">Channels · {chats.length}</p>
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {chats.map((channel) => (
              <button key={channel.id} type="button" onClick={() => { setSelected(channel.id); setDraft(""); }} aria-pressed={room?.id === channel.id}
                className={"min-w-[170px] max-w-full rounded-md border p-3 text-left lg:min-w-0 lg:w-full " + (room?.id === channel.id ? "border-navy bg-navy text-paper" : "border-transparent bg-card hover:border-navy")}>
                <span className="flex items-center gap-2 break-words text-sm font-semibold"><MessagesSquare className="h-4 w-4 shrink-0" aria-hidden /> {channel.name}</span>
                <span className="mt-1 block break-words text-xs opacity-75">{channel.topic}</span>
              </button>
            ))}
          </div>
        </nav>
        <div className="flex min-w-0 flex-col">
          {room ? <>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
              <div className="min-w-0"><p className="break-words font-semibold text-navy">{room.name}</p><p className="break-words text-xs text-muted-foreground">{room.topic}</p></div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="h-4 w-4" aria-hidden /> Demo room</span>
            </div>
            <ol className="flex max-h-[440px] min-h-[260px] flex-col gap-4 overflow-y-auto bg-paper p-4" aria-label={"Messages in " + room.name}>
              {room.messages.map((m) => {
                const own = m.author === "You" && !m.sample;
                return <li key={m.id} className={"flex min-w-0 gap-2 " + (own ? "justify-end" : "justify-start")}>
                  {!own && <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy font-mono text-xs font-bold text-paper">{initials(m.author)}</span>}
                  <div className={"min-w-0 max-w-[87%] rounded-lg border p-3 sm:max-w-[78%] " + (own ? "border-cardinal bg-cardinal text-paper" : "border-border bg-card")}>
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs"><strong>{m.author}</strong>{m.sample && <span className="opacity-70">(fictional)</span>}</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{m.body}</p>
                    <p className="mt-2 text-[11px] opacity-70">{formatTime(m.at)}</p>
                  </div>
                </li>;
              })}
            </ol>
            <form className="border-t bg-cream p-4" onSubmit={send}>
              <label htmlFor="sample-chat-message" className="mb-2 block text-sm font-semibold">Try sending a message to this demo room</label>
              <div className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap">
                <input id="sample-chat-message" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={600}
                  className="min-h-11 min-w-0 flex-1 rounded-md border bg-card px-3 text-sm" placeholder="Write a message…" autoComplete="off" />
                <Button type="submit" variant="cardinal" disabled={!draft.trim()}><Send aria-hidden /> Send locally</Button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Demonstration only. Sample people and messages are fictional. Your reply stays in this browser and is not delivered to anyone.
              </p>
            </form>
          </> : <p className="p-6 text-sm text-muted-foreground">No demo chat rooms are available.</p>}
        </div>
      </div>
    </section>
  );
}
