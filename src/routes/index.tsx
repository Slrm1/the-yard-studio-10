import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, ArrowRight, Users } from "lucide-react";
import heroArt from "@/assets/yard-hero.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/store";
import { ProjectTile } from "@/components/project-art";
import { CampusImage, CampusPhotoCredit } from "@/components/campus-photo";
import { CAMPUS_PHOTOS, FEATURED_CAMPUS_PHOTOS } from "@/lib/campus-photos";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { EmptyState, YMark } from "@/components/brand";
import { formatTime } from "@/lib/model";
import { SAMPLE_EVENTS, SAMPLE_PEOPLE } from "@/lib/showcase";

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
  const { projects, activity, orgs, chats } = useAppState();
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

      <section className="mb-12" aria-labelledby="campus-snapshots">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-cardinal">Scenes from Howard University</p>
            <h2 id="campus-snapshots" className="font-display mt-1 text-3xl text-navy sm:text-4xl">Campus snapshots</h2>
          </div>
          <Link to="/map" className="text-sm font-semibold text-cardinal underline underline-offset-4">Explore the campus map →</Link>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">Real Howard campus photography, shown for atmosphere. The projects, people and events in this demo are fictional.</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {FEATURED_CAMPUS_PHOTOS.slice(0, 4).map((id) => {
            const photo = CAMPUS_PHOTOS[id];
            return (
              <figure key={id} className="min-w-0 overflow-hidden rounded-md border bg-card">
                <div className="aspect-[4/3] overflow-hidden bg-navy">
                  <CampusImage photo={photo} className="h-full w-full object-cover" />
                </div>
                <figcaption className="p-3">
                  <p className="font-semibold leading-tight text-navy">{photo.title}</p>
                  <CampusPhotoCredit photo={photo} className="mt-1 block text-muted-foreground" />
                </figcaption>
              </figure>
            );
          })}
        </div>
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

      <section className="mt-14" aria-labelledby="around-yard">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><p className="eyebrow text-cardinal">Fictional preview content</p>
            <h2 id="around-yard" className="font-display mt-2 break-words text-3xl text-navy sm:text-4xl">Around the Yard</h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">These people, events and messages are fictional examples to demonstrate what a lively student creative community could look like.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="min-w-0 rounded-md border-2 border-ink bg-cream p-5">
            <p className="eyebrow text-cardinal">Event concepts · sample only</p>
            <h3 className="font-display mt-3 break-words text-2xl text-navy">{SAMPLE_EVENTS[3]?.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{SAMPLE_EVENTS[3]?.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground">No actual event is scheduled.</p>
            <Link to="/seasonal" className="mt-5 inline-block text-sm font-semibold text-cardinal underline underline-offset-2">Explore event concepts →</Link>
          </article>
          <article className="min-w-0 rounded-md border-2 border-ink bg-navy p-5 text-paper">
            <p className="eyebrow text-paper/70">Sample group chat</p>
            <h3 className="font-display mt-3 break-words text-2xl">{chats[0]?.name ?? "The Yard · general"}</h3>
            <p className="mt-3 break-words rounded-md bg-paper/10 p-3 text-sm italic">“{chats[0]?.messages[0]?.body ?? "What are you building this week?"}”</p>
            <p className="mt-2 text-xs text-paper/65">Fictional conversation. Messages aren't delivered to people.</p>
            <Link to="/lounge" className="mt-5 inline-block text-sm font-semibold text-paper underline underline-offset-2">Open demo chats →</Link>
          </article>
          <article className="min-w-0 rounded-md border-2 border-ink bg-card p-5">
            <p className="eyebrow text-cardinal">Meet the example crew</p>
            <div className="mt-4 flex flex-wrap -space-x-2">
              {SAMPLE_PEOPLE.slice(0, 5).map((person, i) => <div key={person.id} title={person.name + " — fictional profile"} aria-label={person.name + " fictional profile"}
                className={"grid h-11 w-11 place-items-center rounded-full border-2 border-paper font-mono text-xs font-bold " + (i % 2 ? "bg-cardinal text-paper" : "bg-navy text-paper")}>{person.initials}</div>)}
            </div>
            <h3 className="font-display mt-5 break-words text-2xl text-navy">{SAMPLE_PEOPLE.length} fictional profiles</h3>
            <p className="mt-2 text-sm">Designers, developers and researchers collaborating on campus concept projects.</p>
            <Link to="/studios" className="mt-5 inline-block text-sm font-semibold text-cardinal underline underline-offset-2">Meet the demo crew →</Link>
          </article>
        </div>
      </section>
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
