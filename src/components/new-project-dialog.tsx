import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { notify } from "@/lib/announce";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppState, actions } from "@/lib/store";
import { validateProjectName, type Season } from "@/lib/model";

export function NewProjectDialog({
  trigger,
  defaultName = "",
  defaultSeason = null,
  defaultOrg,
  onCreated,
  navigateToEditor = true,
}: {
  trigger: ReactNode;
  defaultName?: string;
  defaultSeason?: Season;
  defaultOrg?: string;
  onCreated?: (id: string) => void;
  navigateToEditor?: boolean;
}) {
  const { orgs } = useAppState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [org, setOrg] = useState(defaultOrg ?? "");
  const [season, setSeason] = useState<string>(defaultSeason ?? "none");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateProjectName(name) ?? (org ? null : "Choose an org studio.");
    setError(err);
    if (err) return;
    const s = season === "none" ? null : (season as Season);
    const template =
      s === "springfest"
        ? { title: name, subtitle: "Concept event page for Spring Fest on the Yard.", cta: "RSVP", primary: "#E51937", accent: "#003352", schedule: [{ id: "s1", time: "Fri 4 PM", label: "Opening set (sample)" }] }
        : undefined;
    const id = actions.createProject({ name, orgId: org, season: s, ...(template ? { template } : {}) });
    notify.success("Project created and saved in this browser");
    setOpen(false);
    setName(defaultName);
    onCreated?.(id);
    if (navigateToEditor) navigate({ to: "/editor", search: { id } });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setError(null); setOrg((v) => v || defaultOrg || orgs[0]?.id || ""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} noValidate>
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-navy">Create project</DialogTitle>
            <DialogDescription>Saved locally in this browser only. No server, no sharing.</DialogDescription>
          </DialogHeader>
          <div className="my-5 space-y-4">
            <div>
              <Label htmlFor="np-name">Project name</Label>
              <Input id="np-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spring Fest Event Page" aria-invalid={!!error} aria-describedby="np-err" autoFocus />
            </div>
            <div>
              <Label htmlFor="np-org">Org studio</Label>
              <Select value={org} onValueChange={setOrg}>
                <SelectTrigger id="np-org"><SelectValue placeholder="Choose an org" /></SelectTrigger>
                <SelectContent>{orgs.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="np-season">Seasonal space</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger id="np-season"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="homecoming">Homecoming room</SelectItem>
                  <SelectItem value="springfest">Spring Fest room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p id="np-err" role="alert" className="min-h-5 text-sm font-medium text-cardinal">{error}</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="cardinal">Create project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
