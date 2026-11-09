import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, RotateCcw, ArrowRight } from "lucide-react";
import { PageHeader, DemoBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { actions, useAppState } from "@/lib/store";
import type { TaskFlags } from "@/lib/model";

export const Route = createFileRoute("/usability")({
  head: () => ({ meta: [
    { title: "Usability Test — The Yard Studio" },
    { name: "description", content: "Four guided local tasks for testing student design workflows." },
  ] }),
  component: Usability,
});

const MISSIONS: { key: keyof TaskFlags; number: string; title: string; description: string; destination: "/seasonal" | "/studios" | "/reviews"; cta: string }[] = [
  { key: "springfestCreated", number: "01", title: "Create a Spring Fest page", description: "Visit Seasonal Spaces and create a project with the Spring Fest template. The project is saved in this browser.", destination: "/seasonal", cta: "Go to Seasonal Spaces" },
  { key: "teammateInvited", number: "02", title: "Try a teammate invitation", description: "Open an Org Studio and record a simulated invite with a valid email. No real email will be sent.", destination: "/studios", cta: "Go to Org Studios" },
  { key: "husaOpened", number: "03", title: "Inspect a review request", description: "Open the HUSA Voting — mobile header change review and assess its readability.", destination: "/reviews", cta: "Open Review Queue" },
  { key: "feedbackLeft", number: "04", title: "Leave specific design feedback", description: "Add a comment to the HUSA mobile header request. Mention a concrete accessibility or UX improvement.", destination: "/reviews", cta: "Comment on the review" },
];

function Usability() {
  const { tasks } = useAppState();
  const completed = MISSIONS.filter((m) => tasks[m.key]).length;
  return (
    <div className="mx-auto max-w-6xl min-w-0">
      <PageHeader eyebrow="Experience lab" title="Usability Test" actions={<DemoBadge>{completed} of 4 complete</DemoBadge>}>
        Four guided tasks to evaluate whether someone can find, understand, and complete the Yard Studio’s core actions.
      </PageHeader>
      <section className="mb-8 overflow-hidden rounded-md border-2 border-ink bg-navy p-6 text-paper">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow text-paper/70">Your progress</p><h2 className="font-display mt-2 text-4xl sm:text-5xl">{completed} / 4 missions</h2></div><p className="text-sm text-paper/80">{completed === 4 ? "All missions complete" : "Keep exploring the Yard"}</p></div>
        <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-paper/20" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={completed} aria-label="Usability missions completed">
          <div className="h-full bg-gold transition-all" style={{ width: (completed * 25) + "%" }} />
        </div>
        <p className="mt-3 text-xs text-paper/80">Progress is saved locally. It doesn't submit any testing results to a researcher.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {MISSIONS.map((m) => <article key={m.key} className="min-w-0 rounded-md border-2 border-ink bg-card p-5 shadow-block">
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-4xl text-cardinal">{m.number}</span>
            <span className={"flex items-center gap-1.5 text-xs font-semibold " + (tasks[m.key] ? "text-success" : "text-muted-foreground")}>
              {tasks[m.key] ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <Circle className="h-5 w-5" aria-hidden />}
              {tasks[m.key] ? "Completed" : "Not completed"}
            </span>
          </div>
          <h2 className="font-display mt-4 break-words text-2xl leading-tight text-navy">{m.title}</h2>
          <p className="mt-3 min-h-16 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
          <Button asChild variant={tasks[m.key] ? "outline" : "cardinal"} className="mt-4 max-w-full whitespace-normal text-left">
            <Link to={m.destination}>{tasks[m.key] ? "Review this step" : m.cta} <ArrowRight className="shrink-0" aria-hidden /></Link>
          </Button>
        </article>)}
      </div>
      <section className="mt-8 rounded-md border bg-cream p-6">
        <h2 className="font-display text-3xl text-navy">Start another test session</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Resetting clears these four completion checkmarks only. It does not delete the projects, organizations, invitations, review comments, or other work you created.</p>
        <Button className="mt-4" variant="outline" onClick={() => actions.resetTasks()}><RotateCcw aria-hidden /> Reset mission progress</Button>
      </section>
    </div>
  );
}
