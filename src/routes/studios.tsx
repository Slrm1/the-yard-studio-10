import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Building2, Mail, Plus, Users } from "lucide-react";
import { PageHeader, DemoBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { actions, useAppState } from "@/lib/store";
import { validateEmail } from "@/lib/model";

export const Route = createFileRoute("/studios")({
  head: () => ({ meta: [
    { title: "Org Studios — The Yard Studio" },
    { name: "description", content: "Explore campus concept teams, create a studio, and try collaboration workflows." },
  ] }),
  component: Studios,
});

function Studios() {
  const { orgs, projects } = useAppState();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [createError, setCreateError] = useState("");
  const [inviteOrg, setInviteOrg] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const create = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim().length < 3 || name.trim().length > 60) {
      setCreateError("Use a studio name between 3 and 60 characters.");
      return;
    }
    if (!tagline.trim()) {
      setCreateError("Add a short description of your studio.");
      return;
    }
    actions.createOrg(name, tagline);
    setName("");
    setTagline("");
    setCreateError("");
    toast.success("Studio created in this browser");
  };
  const invite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteOrg) return;
    const err = validateEmail(email);
    if (err) { setInviteError(err); return; }
    if (orgs.find((o) => o.id === inviteOrg)?.members.some((m) => m.email?.toLowerCase() === email.trim().toLowerCase())) {
      setInviteError("That email has already been added to this demo studio.");
      return;
    }
    actions.inviteMember(inviteOrg, email);
    setInviteError("");
    setEmail("");
    setInviteOrg(null);
    toast.success("Simulated invitation saved — no email was sent");
  };

  return (
    <div className="mx-auto max-w-7xl min-w-0">
      <PageHeader eyebrow="Teams on the Yard" title="Org Studios">
        Build a home for student design concepts, organize projects, and practice team workflows. <strong>All studios and invitations are browser-local demos.</strong>
      </PageHeader>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border-2 border-ink bg-navy p-5 text-paper"><Building2 aria-hidden /><p className="font-display mt-2 text-4xl">{orgs.length}</p><p className="text-sm">Studios</p></div>
        <div className="rounded-md border-2 border-ink bg-cream p-5"><Users aria-hidden /><p className="font-display mt-2 text-4xl">{orgs.reduce((n, o) => n + o.members.length, 0)}</p><p className="text-sm">Listed sample and demo members</p></div>
        <div className="rounded-md border-2 border-ink bg-cardinal p-5 text-paper"><Plus aria-hidden /><p className="font-display mt-2 text-4xl">{projects.length}</p><p className="text-sm">Concept projects</p></div>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="studios-list" className="min-w-0">
          <h2 id="studios-list" className="font-display mb-4 text-3xl text-navy">Explore the studios</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {orgs.map((org) => {
              const ownProjects = projects.filter((p) => p.orgId === org.id);
              return (
                <article key={org.id} className="min-w-0 rounded-md border-2 border-ink bg-card p-5 shadow-block">
                  <div className="flex flex-wrap items-start justify-between gap-2"><DemoBadge>Concept studio</DemoBadge><span className="eyebrow text-muted-foreground">{ownProjects.length} projects</span></div>
                  <h3 className="font-display mt-4 break-words text-3xl leading-tight text-navy">{org.name}</h3>
                  <p className="mt-2 break-words text-sm text-muted-foreground">{org.tagline}</p>
                  <h4 className="mt-5 text-sm font-semibold">Members (sample / local)</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {org.members.map((member, i) => <li className="break-words" key={i}>
                      <span className="font-medium">{member.name}</span> <span className="text-muted-foreground">· {member.role}</span>
                    </li>)}
                  </ul>
                  <h4 className="mt-5 text-sm font-semibold">Projects</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    {ownProjects.map((p) => <li key={p.id}><Link className="break-words text-cardinal underline underline-offset-2" to="/editor" search={{ id: p.id }}>{p.name}</Link></li>)}
                    {!ownProjects.length && <li className="text-muted-foreground">No projects yet. Start the first one below.</li>}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <NewProjectDialog defaultOrg={org.id} trigger={<Button size="sm" variant="cardinal"><Plus aria-hidden /> New project</Button>} />
                    <Button size="sm" variant="outline" onClick={() => { setInviteOrg(inviteOrg === org.id ? null : org.id); setEmail(""); setInviteError(""); }}>
                      <Mail aria-hidden /> {inviteOrg === org.id ? "Close invite" : "Try invite"}
                    </Button>
                  </div>
                  {inviteOrg === org.id && (
                    <form className="mt-4 space-y-2 rounded-md border bg-cream p-3" onSubmit={invite} noValidate>
                      <Label htmlFor={"invite-" + org.id}>Teammate email (simulation)</Label>
                      <Input id={"invite-" + org.id} type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.edu" />
                      <p className="text-xs text-muted-foreground">This records a pretend invite locally. No invitation or email is sent.</p>
                      {inviteError && <p role="alert" className="text-sm text-cardinal">{inviteError}</p>}
                      <Button type="submit" size="sm">Record simulated invite</Button>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        <aside className="h-fit min-w-0 rounded-md border-2 border-ink bg-cream p-5">
          <p className="eyebrow text-cardinal">Start something new</p>
          <h2 className="font-display mt-3 text-3xl text-navy">Create a studio</h2>
          <p className="mt-2 text-sm text-muted-foreground">A space for your group’s concepts and design experiments.</p>
          <form className="mt-5 space-y-4" onSubmit={create} noValidate>
            <div><Label htmlFor="studio-name">Studio name</Label><Input id="studio-name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Bison Design Lab" /></div>
            <div><Label htmlFor="studio-tagline">What will you build?</Label><textarea id="studio-tagline" rows={3} maxLength={200} className="w-full rounded-md border bg-card px-3 py-2 text-sm" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Describe the team’s mission" /></div>
            {createError && <p role="alert" className="text-sm font-semibold text-cardinal">{createError}</p>}
            <Button className="w-full" variant="cardinal" type="submit"><Plus aria-hidden /> Create local studio</Button>
          </form>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">No accounts, shared storage, or real invitations are connected yet. Changes stay in this browser.</p>
        </aside>
      </div>
    </div>
  );
}
