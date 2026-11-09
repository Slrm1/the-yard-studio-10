import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import { PageHeader, DemoBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { useAppState } from "@/lib/store";
import type { Season } from "@/lib/model";

export const Route = createFileRoute("/seasonal")({
  head: () => ({ meta: [
    { title: "Seasonal Spaces — The Yard Studio" },
    { name: "description", content: "Design concepts for Homecoming and Spring Fest." },
  ] }),
  component: Seasonal,
});

const ROOMS: { id: Exclude<Season, null>; name: string; eyebrow: string; blurb: string; prompt: string; tone: string }[] = [
  { id: "homecoming", name: "Homecoming", eyebrow: "Fall / concept room", blurb: "Bring the Hilltop energy to event pages, schedules, and memorable campus experiences.", prompt: "Homecoming Event Concept", tone: "bg-navy text-paper" },
  { id: "springfest", name: "Spring Fest", eyebrow: "Spring / concept room", blurb: "Sketch a bright, welcoming experience for showcases, performances, and student organizations.", prompt: "Spring Fest Event Page", tone: "bg-cardinal text-paper" },
];

function Seasonal() {
  const { projects, orgs } = useAppState();
  return (
    <div className="mx-auto max-w-7xl min-w-0">
      <PageHeader eyebrow="Design for the moment" title="Seasonal Spaces">
        Campus culture inspires the work. Explore event concepts, remix ideas, and make a page for the next campus moment. Schedules shown in templates are fictional.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-2">
        {ROOMS.map((room) => {
          const picks = projects.filter((p) => p.season === room.id);
          return <section key={room.id} className="min-w-0 overflow-hidden rounded-md border-2 border-ink bg-card shadow-block">
            <div className={"relative min-h-52 overflow-hidden p-6 sm:p-8 " + room.tone}>
              <Sparkles className="absolute right-5 top-5 h-8 w-8 opacity-60" aria-hidden />
              <p className="eyebrow opacity-75">{room.eyebrow}</p>
              <h2 className="font-display mt-6 break-words text-5xl leading-tight sm:text-6xl">{room.name}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed opacity-90">{room.blurb}</p>
            </div>
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-2xl text-navy">Projects in this room</h3>
                <DemoBadge>{picks.length} concepts</DemoBadge>
              </div>
              <ul className="space-y-3">
                {picks.map((p) => <li className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-md border bg-cream p-3" key={p.id}>
                  <span className="min-w-0 flex-1 break-words text-sm font-semibold">{p.name}</span>
                  <Button variant="outline" size="sm" asChild><Link to="/editor" search={{ id: p.id }}>Open <ArrowRight aria-hidden /></Link></Button>
                </li>)}
                {!picks.length && <li className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No projects yet — create the first concept for this room.</li>}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <NewProjectDialog
                  defaultSeason={room.id}
                  defaultName={room.prompt}
                  defaultOrg={orgs[0]?.id ?? ""}
                  trigger={<Button variant="cardinal"><CalendarDays aria-hidden /> Start a {room.name} page</Button>}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">New work is saved locally in your browser. No actual event registration or RSVP is sent.</p>
            </div>
          </section>;
        })}
      </div>
      <section className="mt-10 rounded-md border bg-cream p-6">
        <h2 className="font-display text-3xl text-navy">Need another kind of page?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Start a general campus project and customize it in the editor.</p>
        <div className="mt-4"><NewProjectDialog trigger={<Button variant="outline">Create a different project <ArrowRight aria-hidden /></Button>} /></div>
      </section>
    </div>
  );
}
