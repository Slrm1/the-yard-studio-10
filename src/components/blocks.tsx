import type { DesignProps } from "@/lib/model";

// User-chosen hex colors are project content (design data), so they are applied
// through inline style on the canvas only — never in app chrome.

export type BlockDef = { id: string; name: string; description: string; render: (p: DesignProps, mobile: boolean) => React.ReactNode };

const Btn = ({ p, children }: { p: DesignProps; children: React.ReactNode }) => (
  <span className="inline-block rounded px-4 py-2 text-sm font-bold uppercase tracking-wide" style={{ background: p.accent, color: "#fff" }}>
    {children}
  </span>
);

export const BLOCKS: BlockDef[] = [
  {
    id: "hero-banner",
    name: "Editorial Hero",
    description: "Oversized two-line headline with accent rule.",
    render: (p, m) => (
      <div className="p-6" style={{ background: p.primary, color: "#fff" }}>
        <div className="h-1 w-16" style={{ background: p.accent }} />
        <p className={`font-display mt-3 ${m ? "text-3xl" : "text-5xl"}`}>{p.title}</p>
        <p className="mt-2 text-sm opacity-80">{p.subtitle}</p>
      </div>
    ),
  },
  {
    id: "schedule-list",
    name: "Schedule List",
    description: "Time + label rows for events.",
    render: (p) => (
      <div className="p-6">
        <p className="font-display text-xl" style={{ color: p.primary }}>Schedule</p>
        <ul className="mt-2 divide-y" style={{ borderColor: p.primary }}>
          {(p.schedule.length ? p.schedule : [{ id: "x", time: "TBD", label: "Add schedule items in the editor" }]).map((s) => (
            <li key={s.id} className="flex gap-4 py-2 text-sm">
              <span className="w-24 font-mono font-bold" style={{ color: p.accent }}>{s.time}</span>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "vote-card",
    name: "Ballot Card",
    description: "Candidate choice card with large tap targets.",
    render: (p) => (
      <div className="p-6">
        <div className="rounded-md border-2 p-4" style={{ borderColor: p.primary }}>
          <p className="text-xs font-bold uppercase" style={{ color: p.accent }}>Sample ballot — not real</p>
          {["Candidate A (fictional)", "Candidate B (fictional)"].map((c) => (
            <div key={c} className="mt-2 flex min-h-11 items-center justify-between rounded border px-3 text-sm">
              {c} <span className="h-5 w-5 rounded-full border-2" style={{ borderColor: p.primary }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "countdown",
    name: "Countdown Strip",
    description: "Big-number countdown band (static sample numbers).",
    render: (p) => (
      <div className="flex justify-around p-5" style={{ background: p.accent, color: "#fff" }}>
        {[["12", "Days"], ["08", "Hrs"], ["30", "Min"]].map(([n, l]) => (
          <div key={l} className="text-center">
            <p className="font-display text-4xl">{n}</p>
            <p className="text-xs uppercase">{l}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "rsvp-form",
    name: "RSVP Form",
    description: "Name + email capture mock (non-submitting).",
    render: (p) => (
      <div className="space-y-2 p-6">
        <p className="font-display text-xl" style={{ color: p.primary }}>RSVP</p>
        <div className="h-10 rounded border bg-white px-3 py-2 text-sm text-gray-500">Name</div>
        <div className="h-10 rounded border bg-white px-3 py-2 text-sm text-gray-500">Email</div>
        <Btn p={p}>{p.cta}</Btn>
      </div>
    ),
  },
  {
    id: "news-card",
    name: "News Card",
    description: "Headline, kicker and byline for editorial layouts.",
    render: (p) => (
      <div className="grid gap-3 p-6 sm:grid-cols-2">
        {["Campus kicker", "Opinion"].map((k) => (
          <article key={k} className="border-t-4 pt-2" style={{ borderColor: p.accent }}>
            <p className="text-xs font-bold uppercase" style={{ color: p.accent }}>{k}</p>
            <p className="font-display text-xl" style={{ color: p.primary }}>Sample headline for layout</p>
            <p className="text-xs opacity-70">By a sample writer</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "bison-footer",
    name: "Bison Footer",
    description: "Dark footer with links and independent-project note.",
    render: (p) => (
      <div className="p-5 text-xs" style={{ background: "#0d1b26", color: "#f4efe3" }}>
        <p className="font-display text-lg">Bison Built. Yard Born.</p>
        <p className="mt-1 opacity-70">Independent student concept. Not an official university site.</p>
      </div>
    ),
  },
];

export const blockById = (id: string) => BLOCKS.find((b) => b.id === id);

/** Renders a full project page preview. */
export function DesignCanvas({ props, blocks, mobile, onRemoveBlock }: { props: DesignProps; blocks: string[]; mobile: boolean; onRemoveBlock?: (i: number) => void }) {
  return (
    <div className="overflow-hidden text-left" style={{ background: props.background, color: "#14161A" }}>
      <div className="p-6" style={{ background: props.primary, color: "#fff" }}>
        <div className="flex items-center justify-between text-xs uppercase tracking-widest opacity-80">
          <span>Concept</span>
          <span style={{ color: props.accent }}>★</span>
        </div>
        <h2 className={`font-display mt-6 ${mobile ? "text-4xl" : "text-6xl"}`}>{props.title || "Untitled"}</h2>
        <p className="mt-3 max-w-xl text-sm opacity-85">{props.subtitle}</p>
        <div className="mt-5">
          <Btn p={props}>{props.cta || "Call to action"}</Btn>
        </div>
      </div>
      {props.schedule.length > 0 && BLOCKS[1].render(props, mobile)}
      {blocks.map((id, i) => {
        const b = blockById(id);
        if (!b) return null;
        return (
          <div key={`${id}-${i}`} className="group relative border-t border-black/10">
            {b.render(props, mobile)}
            {onRemoveBlock && (
              <button
                type="button"
                onClick={() => onRemoveBlock(i)}
                className="absolute right-2 top-2 rounded bg-ink px-2 py-1 text-xs text-paper opacity-80 hover:opacity-100"
                aria-label={`Remove ${b.name} from canvas`}
              >
                Remove
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
