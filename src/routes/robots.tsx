import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { DataSourceNote, MapPanel, SimulationBanner } from "@/components/campus-ui";
import { LANDMARKS, pinned } from "@/lib/campus";

export const Route = createFileRoute("/robots")({
  head: () => ({ meta: [
    { title: "Robot Simulator (simulation) — The Yard Studio" },
    { name: "description", content: "Practice human–robot interaction with an imaginary helper robot at Howard landmarks. No real robots." },
    { property: "og:title", content: "Robot Simulator — simulation only" },
    { property: "og:description", content: "An imaginary robot for HCI practice. No real robots are tracked." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Robots,
});

const STOPS = LANDMARKS.filter(pinned);
const MESSAGES = ["Hello. I am a pretend helper robot.", "I can show practice information cards.", "For a real emergency, call 911.", "Practice complete. Thank you!"];

function Robots() {
  const [at, setAt] = useState(STOPS[0]?.id ?? "founders");
  const [msg, setMsg] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const place = STOPS.find((s) => s.id === at)!;
  const say = (t: string) => setLog((l) => [t, ...l].slice(0, 8));
  return (
    <div className="mx-auto max-w-7xl">
      <SimulationBanner />
      <PageHeader eyebrow="Human–robot interaction practice" title="Robot simulator">
        An imaginary robot that “appears” at a landmark you choose. It does not move along paths, and no robots are deployed on campus.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <MapPanel selectedId={at} onSelect={(id) => { setAt(id); say(`Simulated robot placed at ${STOPS.find((s) => s.id === id)?.name}`); }} simAtId={at} simLabel="SIM ROBOT" className="h-[55vh] min-h-[320px]" />
        <aside className="min-w-0 space-y-4 rounded-md border bg-card p-4">
          <div>
            <label htmlFor="stop" className="eyebrow">Place simulated robot at</label>
            <select id="stop" value={at} onChange={(e) => { setAt(e.target.value); say(`Simulated robot placed at ${STOPS.find((s) => s.id === e.target.value)?.name}`); }} className="mt-1 h-11 w-full rounded-md border bg-background px-2">
              {STOPS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="rounded-md border-2 border-ink bg-cream p-3" aria-live="polite">
            <p className="eyebrow">Robot says (simulated) · {place.name}</p>
            <p className="mt-1 text-lg font-semibold break-words">{MESSAGES[msg]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { const n = (msg + 1) % MESSAGES.length; setMsg(n); say(`Robot: ${MESSAGES[n]}`); }}>Next robot message</Button>
            <Button variant="outline" onClick={() => say("You: waved to the robot (practice)")}>Wave</Button>
            <Button variant="outline" onClick={() => { setMsg(0); setLog([]); }}>Reset</Button>
          </div>
          <div>
            <p className="eyebrow mb-1">Practice log</p>
            <ul className="space-y-1 text-sm">{log.length ? log.map((l, i) => <li key={i} className="break-words">{l}</li>) : <li className="text-muted-foreground">No interactions yet.</li>}</ul>
          </div>
        </aside>
      </div>
      <DataSourceNote />
    </div>
  );
}
