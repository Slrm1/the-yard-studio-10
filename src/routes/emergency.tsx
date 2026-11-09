import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { DataSourceNote, LandmarkDirectory, MapPanel, OfficialMapLink, SimulationBanner } from "@/components/campus-ui";
import { LANDMARKS } from "@/lib/campus";
import { useAppState, actions } from "@/lib/store";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [
    { title: "Emergency Mode (simulation) — The Yard Studio" },
    { name: "description", content: "Educational preparedness scenarios set at Howard landmarks. Simulation only, not a live alert." },
    { property: "og:title", content: "Emergency Mode — simulation only" },
    { property: "og:description", content: "Practice preparedness scenarios. Not a live emergency alert." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Emergency,
});

const SCENARIOS = [
  { id: "fire", title: "Fire alarm practice", at: "founders", steps: ["Stop what you are doing when the alarm sounds.", "Follow posted building signs and staff instructions.", "Do not use elevators unless staff direct you to.", "Wait for official all-clear before re-entering."] },
  { id: "weather", title: "Severe weather practice", at: "blackburn", steps: ["Check official Howard alerts and the National Weather Service.", "Move away from windows and glass.", "Follow building staff instructions."] },
  { id: "medical", title: "Medical help practice", at: "burr", steps: ["Call 911 for a medical emergency.", "Tell the dispatcher the building name and floor.", "Stay with the person if it is safe to do so."] },
] as const;

function Emergency() {
  const { drillActive, safetyStatus } = useAppState();
  const [scn, setScn] = useState<(typeof SCENARIOS)[number]>(SCENARIOS[0]);
  const [sel, setSel] = useState<string | null>(scn.at);
  const place = LANDMARKS.find((l) => l.id === scn.at)!;
  return (
    <div className="mx-auto max-w-7xl">
      <SimulationBanner />
      <PageHeader eyebrow="Preparedness practice · educational" title="Emergency mode" actions={<OfficialMapLink />}>
        Pick a practice scenario set at a real campus landmark. No routes are suggested; follow posted signs and staff in a real event.
      </PageHeader>
      <div role="tablist" aria-label="Practice scenarios" className="mb-6 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <Button key={s.id} role="tab" aria-selected={scn.id === s.id} variant={scn.id === s.id ? "default" : "outline"} onClick={() => { setScn(s); setSel(s.at); }}>{s.title}</Button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-md border-2 border-ink bg-card p-5" aria-labelledby="scn-title">
            <p className="eyebrow text-cardinal">Practice scenario · {place.name}</p>
            <h2 id="scn-title" className="font-display mt-2 text-3xl text-navy break-words">{scn.title}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5">{scn.steps.map((t) => <li key={t}>{t}</li>)}</ol>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant={drillActive ? "outline" : "cardinal"} onClick={() => actions.setDrill(!drillActive)}>{drillActive ? "End practice drill" : "Start practice drill"}</Button>
              <Button variant="outline" aria-pressed={safetyStatus === "safe"} onClick={() => actions.setSafety("safe")}>Practice: I’m OK</Button>
              <Button variant="outline" aria-pressed={safetyStatus === "assist"} onClick={() => actions.setSafety("assist")}>Practice: I need help</Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
              {drillActive ? "Practice drill running (simulated). " : ""}
              {safetyStatus ? `Practice status saved in this browser only: ${safetyStatus === "safe" ? "OK" : "Needs help"}. Nobody is notified.` : "Practice status buttons notify no one."}
            </p>
          </section>
          <MapPanel selectedId={sel} onSelect={setSel} highlightIds={[scn.at]} className="h-[50vh] min-h-[320px]" />
          <p className="text-sm">Want to rehearse robot assistance? <Link to="/robots" className="text-cardinal underline">Open the Robot Simulator</Link>.</p>
        </div>
        <aside aria-label="Landmarks"><LandmarkDirectory selectedId={sel} onSelect={setSel} /></aside>
      </div>
      <DataSourceNote />
    </div>
  );
}
