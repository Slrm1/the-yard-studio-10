import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ArrowRight, Sparkles, Bookmark, Check } from "lucide-react";
import { PageHeader, DemoBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { actions, useAppState } from "@/lib/store";
import { SAMPLE_EVENTS } from "@/lib/showcase";
import { CAMPUS_PHOTOS } from "@/lib/campus-photos";
import { CampusImage, CampusPhotoCredit } from "@/components/campus-photo";
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
  const { projects, orgs, savedEventIds } = useAppState();
  return (
    <div className="mx-auto max-w-7xl min-w-0">
      <PageHeader eyebrow="Design for the moment" title="Seasonal Spaces">
        Campus culture inspires the work. Explore event concepts, remix ideas, and make a page for the next campus moment. Schedules shown in templates are fictional.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-2">
        {ROOMS.map((room) => {
          const picks = projects.filter((p) => p.season === room.id);
          const events = SAMPLE_EVENTS.filter((event) => event.season === room.id);
          return <section key={room.id} className="min-w-0 overflow-hidden rounded-md border-2 border-ink bg-card shadow-block">
            <div className={"relative min-h-52 overflow-hidden p-6 sm:p-8 " + room.tone}>
              <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
                <CampusImage photo={room.id === "homecoming" ? CAMPUS_PHOTOS.quad : CAMPUS_PHOTOS.courtyard} decorative />
              </div>
              <Sparkles className="absolute right-5 top-5 h-8 w-8 opacity-60" aria-hidden />
              <p className="eyebrow relative opacity-75">{room.eyebrow}</p>
              <h2 className="font-display relative mt-6 break-words text-5xl leading-tight sm:text-6xl">{room.name}</h2>
              <p className="relative mt-3 max-w-md text-sm leading-relaxed opacity-90">{room.blurb}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-cream px-5 py-2 text-muted-foreground">
              <CampusPhotoCredit photo={room.id === "homecoming" ? CAMPUS_PHOTOS.quad : CAMPUS_PHOTOS.courtyard} />
              <span className="text-xs">Real campus photo · fictional event concepts below</span>
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
              <section className="mt-7 border-t pt-5" aria-label={room.name + " fictional event examples"}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display break-words text-2xl text-navy">Sample event lineup</h3>
                  <DemoBadge>Fictional events</DemoBadge>
                </div>
                <p className="mb-4 mt-1 text-xs text-muted-foreground">Made-up examples for product demonstration, not official Howard University events, schedules, reservations, or locations.</p>
                <div className="space-y-3">
                  {events.map((event) => {
                    const saved = savedEventIds.includes(event.id);
                    return <article key={event.id} className="min-w-0 rounded-md border bg-cream p-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="eyebrow text-cardinal">{event.kind}</span>
                        <span className="text-xs font-semibold text-muted-foreground">Sample only</span>
                      </div>
                      <h4 className="font-display mt-2 break-words text-xl leading-tight text-navy sm:text-2xl">{event.title}</h4>
                      <p className="mt-2 text-xs font-semibold">{event.day} · {event.time}</p>
                      <p className="mt-1 break-words text-xs text-muted-foreground">{event.place}</p>
                      <p className="mt-3 break-words text-sm leading-relaxed">{event.summary}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Concept organizer: {event.host}</p>
                      <Button size="sm" variant={saved ? "outline" : "cardinal"} className="mt-3 max-w-full whitespace-normal" aria-pressed={saved}
                        onClick={() => actions.toggleEventInterest(event.id)}>
                        {saved ? <Check aria-hidden /> : <Bookmark aria-hidden />}
                        {saved ? "Saved to your demo list" : "Save sample event"}
                      </Button>
                    </article>;
                  })}
                </div>
              </section>
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
