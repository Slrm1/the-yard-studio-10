import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppState, actions } from "@/lib/store";
import { DesignCanvas } from "@/components/blocks";
import { PageHeader, EmptyState } from "@/components/brand";
import { ProjectTile } from "@/components/project-art";
import { formatTime, uid } from "@/lib/model";

export const Route = createFileRoute("/editor")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => typeof s.id === "string" ? { id: s.id } : {},
  head: () => ({ meta: [{ title: "Design Editor — The Yard Studio" }, { name: "description", content: "Edit a campus design concept with live preview." }, { property: "og:title", content: "Design Editor" }, { property: "og:description", content: "Live, local design editing." }] }),
  component: Editor,
});

function Editor() {
  const { id } = Route.useSearch();
  const { projects } = useAppState();
  const [mobile, setMobile] = useState(false);
  const p = projects.find((x) => x.id === id);
  if (!p)
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow="Design editor" title="Pick a project">Choose a concept to edit.</PageHeader>
        {projects.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{projects.map((x) => <ProjectTile key={x.id} project={x} />)}</div> : <EmptyState title="No projects yet" />}
      </div>
    );
  const set = (k: "title" | "subtitle" | "cta" | "primary" | "accent" | "background", v: string) => actions.updateProps(p.id, { [k]: v });
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Design editor · autosaved locally" title={p.name} actions={<>
        <Button variant="outline" onClick={() => setMobile((m) => !m)}>{mobile ? "Desktop" : "Mobile"} preview</Button>
        <Button variant="outline" onClick={() => { actions.saveVersion(p.id, "Manual save"); toast.success("Version saved in this browser"); }}>Save version</Button>
        <Button variant="cardinal" onClick={() => { actions.submitForReview(p.id, "Submitted from editor"); toast.success("Review request created (local)"); }}>Submit for review</Button>
      </>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex justify-center rounded-md border-2 border-ink bg-muted p-4 paper-grain">
          <div className={mobile ? "w-[375px] max-w-full" : "w-full"}>
            <DesignCanvas props={p.props} blocks={p.blocks} mobile={mobile} onRemoveBlock={(i) => actions.removeBlock(p.id, i)} />
          </div>
        </div>
        <aside className="space-y-4 rounded-md border bg-card p-4">
          {(["title", "subtitle", "cta"] as const).map((k) => (
            <div key={k}><Label htmlFor={k} className="capitalize">{k === "cta" ? "CTA text" : k}</Label><Input id={k} value={p.props[k]} onChange={(e) => set(k, e.target.value)} /></div>
          ))}
          <div className="grid grid-cols-3 gap-2">
            {(["primary", "accent", "background"] as const).map((k) => (
              <div key={k}><Label htmlFor={k} className="capitalize text-xs">{k}</Label><Input id={k} type="color" value={p.props[k]} onChange={(e) => set(k, e.target.value)} className="h-10 p-1" /></div>
            ))}
          </div>
          <div>
            <p className="eyebrow mb-2">Schedule</p>
            {p.props.schedule.map((s, i) => (
              <div key={s.id} className="mb-2 flex gap-1">
                <Input aria-label="Time" value={s.time} className="w-24" onChange={(e) => actions.updateProps(p.id, { schedule: p.props.schedule.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)) })} />
                <Input aria-label="Label" value={s.label} onChange={(e) => actions.updateProps(p.id, { schedule: p.props.schedule.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
                <Button size="icon" variant="ghost" aria-label="Remove item" onClick={() => actions.updateProps(p.id, { schedule: p.props.schedule.filter((_, j) => j !== i) })}>×</Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => actions.updateProps(p.id, { schedule: [...p.props.schedule, { id: uid("s"), time: "TBD", label: "New item" }] })}>Add item</Button>
          </div>
          <Button asChild variant="outline" size="sm"><Link to="/library">Add component from library</Link></Button>
          <div>
            <p className="eyebrow mb-2">Version history</p>
            <ul className="max-h-40 space-y-1 overflow-auto text-sm">{p.versions.map((v) => (
              <li key={v.id} className="flex justify-between gap-2"><span>{v.label} · {formatTime(v.at)}</span><button className="text-cardinal underline" onClick={() => actions.restoreVersion(p.id, v.id)}>Restore</button></li>
            ))}</ul>
          </div>
          <div>
            <p className="eyebrow mb-2">Simulated branch history</p>
            <ul className="max-h-40 space-y-1 overflow-auto text-xs">{p.branches.map((b) => <li key={b.id}><span className="font-mono">{b.branch}</span> — {b.event} · {formatTime(b.at)}</li>)}</ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
