import { notify } from "@/lib/announce";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, FolderKanban, GitPullRequest, IdCard, Users } from "lucide-react";
import { PageHeader, DemoBadge, YMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ROLES, roleLabel, formatTime, type Role } from "@/lib/model";
import { actions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "My Bison Card — The Yard Studio" },
    { name: "description", content: "Your local demonstration profile, activity and role permissions." },
  ] }),
  component: Profile,
});

function Profile() {
  const { role, projects, reviews, orgs, activity, tasks } = useAppState();
  const current = ROLES.find((r) => r.id === role);
  const done = Object.values(tasks).filter(Boolean).length;
  return (
    <div className="mx-auto max-w-7xl min-w-0">
      <PageHeader eyebrow="Your studio identity" title="My Bison Card">
        See what your demo role can do and explore activity recorded in this browser. This is not a university ID or a verified personal profile.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)]">
        <section className="min-w-0 overflow-hidden rounded-md border-2 border-ink bg-card shadow-block">
          <div className="bg-navy-deep p-6 text-paper">
            <div className="flex min-w-0 items-center justify-between gap-3"><YMark className="h-14 w-14 shrink-0" /><DemoBadge className="text-paper">Demo profile</DemoBadge></div>
            <p className="eyebrow mt-5 text-paper/70">The Yard Studio</p>
            <h2 className="font-display mt-2 break-words text-5xl">You</h2>
            <p className="mt-2 break-words text-paper/80">{roleLabel(role)}</p>
            <p className="mt-5 text-xs leading-relaxed text-paper/70">Bison Built. Yard Born. · Independent student project</p>
          </div>
          <div className="p-5">
            <label htmlFor="profile-role" className="block text-sm font-semibold">Try another demo role</label>
            <select id="profile-role" value={role} onChange={(e) => { actions.setRole(e.target.value as Role); notify.success(`Role switched to ${e.target.selectedOptions[0]?.text ?? e.target.value}`); }} className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm">
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <p className="mt-3 text-sm text-muted-foreground">{current?.blurb}</p>
            <div className="mt-5 border-t pt-4">
              <h3 className="font-display text-2xl text-navy">What your role can do</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>✓ Explore and comment on concept projects</li>
                <li>✓ Create local drafts and experiment with components</li>
                <li>{role === "reviewer" || role === "lead" ? "✓" : "—"} Approve or request changes in the review demo</li>
                <li>{role === "lead" ? "✓" : "—"} Simulate merging approved reviews</li>
                <li className="text-muted-foreground">These are UI permissions for practice, not real account access controls.</li>
              </ul>
            </div>
          </div>
        </section>
        <div className="min-w-0 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: FolderKanban, number: projects.length, name: "Concept projects" },
              { icon: Users, number: orgs.length, name: "Local studios" },
              { icon: GitPullRequest, number: reviews.length, name: "Review requests" },
              { icon: IdCard, number: done + "/4", name: "Usability tasks" },
            ].map(({ icon: Icon, number, name }) => <div key={name} className="min-w-0 rounded-md border-2 border-ink bg-cream p-5"><Icon className="h-5 w-5 text-cardinal" aria-hidden /><p className="font-display mt-2 break-words text-4xl text-navy">{number}</p><p className="text-sm">{name}</p></div>)}
          </div>
          <section className="rounded-md border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-3xl text-navy">Recent activity</h2><Activity className="h-5 w-5 text-cardinal" aria-hidden /></div>
            <ol className="mt-4 divide-y">
              {activity.slice(0, 8).map((a) => <li key={a.id} className="flex min-w-0 flex-wrap justify-between gap-x-4 gap-y-1 py-3 text-sm"><span className="min-w-0 flex-1 break-words">{a.text}</span><time className="shrink-0 text-xs text-muted-foreground">{formatTime(a.at)}</time></li>)}
              {!activity.length && <li className="text-sm text-muted-foreground">No activity saved yet.</li>}
            </ol>
          </section>
          <section className="rounded-md bg-navy p-5 text-paper">
            <h2 className="font-display text-3xl">What's next?</h2>
            <p className="mt-2 text-sm text-paper/80">Create a project, try the review queue, or run the four usability missions.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" className="text-ink"><Link to="/editor">Design editor</Link></Button>
              <Button asChild variant="outline" className="text-ink"><Link to="/usability">Usability test</Link></Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
