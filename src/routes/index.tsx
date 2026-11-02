import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, ArrowRight, Users } from "lucide-react";
import heroArt from "@/assets/yard-hero.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/store";
import { ProjectTile } from "@/components/project-art";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { EmptyState, YMark } from "@/components/brand";
import { formatTime } from "@/lib/model";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Yard — The Yard Studio" },
      { name: "description", content: "Discover campus design concepts, find collaborators and start a project." },
      { property: "og:title", content: "The Yard — Bison Built. Yard Born." },
      { property: "og:description", content: "A student concept workspace for campus UI design." },
    ],
  }),
  component: TheYard,
});

function TheYard() {
  const { projects, activity, orgs } = useAppState();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return projects;
    return projects.filter((p) => [p.name, ...p.tags, orgs.find((o) => o.id === p.orgId)?.name ?? ""].join(" ").toLowerCase().includes(t));
  }, [q, projects, orgs]);
  const seeking = projects.filter((p) => p.seekingCollaborators);

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative mb-12 grid overflow-hidden rounded-md border-2 border-ink bg-cream md:grid-cols-[1.1fr_1fr]">
        <div className="relative z-10 p-6 md:p-10">
          <p className="eyebrow text-cardinal">Independent student concept workspace</p>
          <h1 className="font-display mt-4 text-[clamp(3.5rem,9vw,7.5rem)] text-navy">
            <span className="block -rotate-2">Bison Built.</span>
            <span className="relative ml-6 block rotate-1 text-cardinal md:ml-14">
              Yard Born.
              <YMark className="absolute -right-2 -top-6 h-12 w-12 rotate-12 md:-right-8" label={false} />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">Design campus interfaces together: sketch, review and merge concepts for orgs, events and research — saved right in your browser.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NewProjectDialog trigger={<Button variant="cardinal" size="lg"><Plus /> Create project</Button>} />
            <Button asChild variant="outline" size="lg"><Link to="/usability">Start usability test</Link></Button>
          </div>
        </div>
        <img src={heroArt} width={1280} height={896} alt="Illustration of students sketching interface designs together on a campus lawn" className="h-64 w-full object-cover md:h-full" />
      </section>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-4xl text-navy">Trending on the Yard</h2>
        <div className="relative md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, tags, orgs" className="pl-9" aria-label="Search projects" />
        </div>
      </div>
      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => <ProjectTile key={p.id} project={p} className={i === 0 && !q ? "lg:col-span-2" : ""} />)}
        </div>
      ) : (
        <EmptyState title="No projects match">Try another search, or create a new project.</EmptyState>
      )}

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="collab">
          <h2 id="collab" className="font-display mb-4 text-3xl text-navy">Requests for collaborators</h2>
          <ul className="space-y-3">
            {seeking.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-md border bg-card p-4">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-3.5 w-3.5" aria-hidden /> {p.seekingCollaborators} <span className="eyebrow ml-1">(sample)</span></p>
                </div>
                <Button asChild size="sm" variant="outline"><Link to="/editor" search={{ id: p.id }}>Open <ArrowRight /></Link></Button>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="activity">
          <h2 id="activity" className="font-display mb-4 text-3xl text-navy">Recent activity</h2>
          <ol className="divide-y rounded-md border bg-card">
            {activity.slice(0, 7).map((a) => (
              <li key={a.id} className="flex justify-between gap-4 p-3 text-sm">
                <span>{a.text}</span>
                <time className="eyebrow shrink-0 text-muted-foreground">{formatTime(a.at)}</time>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
