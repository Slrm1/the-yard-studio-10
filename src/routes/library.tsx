import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Layers3, Plus, Search } from "lucide-react";
import { PageHeader, EmptyState, DemoBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BLOCKS } from "@/components/blocks";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { actions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [
    { title: "Founders Library — The Yard Studio" },
    { name: "description", content: "Explore reusable campus design components and add them to a project." },
  ] }),
  component: Library,
});

function Library() {
  const { projects } = useAppState();
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<string>("");
  const [selectedBlock, setSelectedBlock] = useState<string>("hero-banner");
  const project = projects.find((p) => p.id === chosen) ?? projects[0];
  const blocks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOCKS.filter((b) => !q || (b.name + " " + b.description).toLowerCase().includes(q));
  }, [query]);
  const preview = BLOCKS.find((b) => b.id === selectedBlock) ?? BLOCKS[0];
  const add = (id: string) => {
    if (!project) { toast.error("Create a project first"); return; }
    actions.addBlock(project.id, id);
    toast.success("Component added to " + project.name);
  };

  return (
    <div className="mx-auto max-w-7xl min-w-0">
      <PageHeader eyebrow="Reusable components" title="Founders Library" actions={
        <NewProjectDialog trigger={<Button variant="cardinal"><Plus aria-hidden /> New project</Button>} />
      }>
        A curated kit for campus design concepts. Browse, preview, and add a component to any project.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
        <section className="min-w-0" aria-labelledby="catalog">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 id="catalog" className="font-display text-3xl text-navy">The component shelf</h2>
            <span className="eyebrow text-muted-foreground">{blocks.length} components</span>
          </div>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" aria-label="Search components" placeholder="Search by component name or purpose" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {blocks.map((b) => (
              <article key={b.id} className={"min-w-0 rounded-md border-2 bg-card p-4 " + (preview?.id === b.id ? "border-cardinal" : "border-border")}>
                <div className="flex items-start justify-between gap-2"><Layers3 className="h-5 w-5 shrink-0 text-cardinal" aria-hidden /><DemoBadge>Concept</DemoBadge></div>
                <h3 className="font-display mt-4 break-words text-2xl text-navy">{b.name}</h3>
                <p className="mt-2 min-h-10 break-words text-sm text-muted-foreground">{b.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedBlock(b.id)} aria-pressed={preview?.id === b.id}>Preview</Button>
                  <Button variant="cardinal" size="sm" disabled={!project} onClick={() => add(b.id)}><Plus aria-hidden /> Add</Button>
                </div>
              </article>
            ))}
          </div>
          {!blocks.length && <EmptyState title="No components found">Try a different search.</EmptyState>}
        </section>
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-md border-2 border-ink bg-cream p-4">
            <h2 className="font-display text-3xl text-navy">Project destination</h2>
            <label htmlFor="library-project" className="mt-3 block text-sm font-semibold">Add components to</label>
            {projects.length ? (
              <select id="library-project" value={project?.id ?? ""} onChange={(e) => setChosen(e.target.value)} className="mt-2 h-11 w-full min-w-0 rounded-md border bg-card px-3 text-sm">
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            ) : <p className="mt-3 text-sm text-muted-foreground">No project yet. Create one to use a component.</p>}
            {project && <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">{project.blocks.length} component instances on this canvas</p>
              <Button asChild variant="outline" size="sm"><Link to="/editor" search={{ id: project.id }}>Open editor</Link></Button>
            </div>}
          </section>
          <section className="overflow-hidden rounded-md border-2 border-ink bg-card">
            <div className="border-b bg-navy p-4 text-paper">
              <p className="eyebrow text-paper/70">Live concept preview</p>
              <h2 className="font-display mt-1 break-words text-3xl">{preview?.name ?? "Component"}</h2>
            </div>
            <div className="min-w-0 overflow-x-auto">
              {preview && project ? preview.render(project.props, false) : <p className="p-5 text-sm text-muted-foreground">Choose or create a project to preview its colors.</p>}
            </div>
            {preview && <div className="flex flex-wrap gap-2 border-t p-4">
              <Button variant="cardinal" disabled={!project} onClick={() => add(preview.id)}><Plus aria-hidden /> Add this component</Button>
              {project && <Button asChild variant="outline"><Link to="/editor" search={{ id: project.id }}>Edit canvas</Link></Button>}
            </div>}
          </section>
          <p className="text-xs text-muted-foreground">Components and projects are demonstration data stored locally in this browser. No external component service is connected.</p>
        </aside>
      </div>
    </div>
  );
}
