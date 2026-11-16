import { usability } from "@/lib/usability";
import { announce } from "@/lib/announce";
import { lazy, Suspense, useState, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ExternalLink, LocateFixed, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, LANDMARKS, OFFICIAL_MAP_URL, filterLandmarks, pinned, type Category, type Landmark } from "@/lib/campus";
import { cn } from "@/lib/utils";

const CampusMap = lazy(() => import("./campus-map"));

export const SIM_TEXT = "SIMULATION ONLY — not a live emergency alert, navigation or robot tracking";

export function SimulationBanner() {
  return (
    <div role="note" aria-label="Simulation disclaimer" className="sticky top-14 z-30 mb-6 rounded-md border-2 border-alert-ink bg-alert p-3 text-alert-ink lg:top-0">
      <p className="font-display text-xl leading-tight break-words sm:text-2xl">{SIM_TEXT}</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm font-semibold">
        <Phone className="h-4 w-4 shrink-0" aria-hidden /> Real emergency? Call <a className="underline" href="tel:911">911</a> or the Howard University Department of Public Safety emergency line
        (<a className="underline" href="tel:+12028067777">202-806-7777</a>). Follow official university alerts.
      </p>
    </div>
  );
}

export function OfficialMapLink({ className }: { className?: string }) {
  return (
    <Button asChild variant="cardinal" className={className}>
      <a href={OFFICIAL_MAP_URL} target="_blank" rel="noopener noreferrer">Open Howard University map <ExternalLink aria-hidden /></a>
    </Button>
  );
}

export function MapPanel(props: { selectedId: string | null; onSelect: (id: string) => void; simAtId?: string | null; simLabel?: string; highlightIds?: string[]; className?: string }) {
  const [recenter, setRecenter] = useState(0);
  const fallback = <div className="grid h-full min-h-[320px] place-items-center bg-muted p-4 text-center text-sm text-muted-foreground">Loading map… If it does not appear, use the building list or the official Howard map link.</div>;
  return (
    <div className={cn("relative overflow-hidden rounded-md border-2 border-ink bg-muted", props.className)}>
      <ClientOnly fallback={fallback}>
        <Suspense fallback={fallback}>
          <CampusMap {...props} recenterKey={recenter} />
        </Suspense>
      </ClientOnly>
      <Button type="button" size="sm" variant="outline" onClick={() => setRecenter((n) => n + 1)} className="absolute right-2 top-2 z-[500] bg-card">
        <LocateFixed aria-hidden /> Recenter
      </Button>
    </div>
  );
}

export function LandmarkDirectory({ selectedId, onSelect, extra }: { selectedId: string | null; onSelect: (id: string) => void; extra?: (l: Landmark) => ReactNode }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const list = filterLandmarks(LANDMARKS, q, cat);
  return (
    <div className="min-w-0 space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search buildings" aria-label="Search buildings" className="pl-9" />
      </div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
        {(["all", ...CATEGORIES] as const).map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
            className={cn("min-h-9 rounded-full border px-3 text-xs font-semibold", cat === c ? "border-navy bg-navy text-paper" : "bg-card hover:bg-accent")}>
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">{list.length} of {LANDMARKS.length} places</p>
      <ul className="space-y-2">
        {list.map((l) => (
          <li key={l.id}>
            <button type="button" onClick={() => { onSelect(l.id); if (l.id === "founders") usability.markAuto("map-directory"); announce(`Selected ${l.name}. Details shown below.`); }} aria-pressed={selectedId === l.id}
              className={cn("w-full rounded-md border p-3 text-left hover:bg-accent", selectedId === l.id ? "border-2 border-cardinal bg-card" : "bg-card")}>
              <span className="block font-semibold break-words">{l.name}</span>
              <span className="eyebrow text-muted-foreground">{l.category}{pinned(l) ? "" : " · no pin (area)"}</span>
            </button>
            {selectedId === l.id && (
              <div className="mt-1 rounded-md border bg-cream p-3 text-sm">
                <p className="font-semibold break-words">Official name: {l.officialName}</p>
                <p className="mt-1">{l.description}</p>
                {extra?.(l)}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {l.officialUrl && <a className="text-cardinal underline" href={l.officialUrl} target="_blank" rel="noopener noreferrer">Official Howard page</a>}
                  {l.osmWay && <a className="text-cardinal underline" href={`https://www.openstreetmap.org/way/${l.osmWay}`} target="_blank" rel="noopener noreferrer">OpenStreetMap source</a>}
                </div>
              </div>
            )}
          </li>
        ))}
        {!list.length && <li className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No places match. Clear the search or pick “All”.</li>}
      </ul>
    </div>
  );
}

export function DataSourceNote() {
  return (
    <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
      Data sources: building positions from OpenStreetMap contributors; names and descriptions from Howard University’s Central Campus Map. This is an unofficial student project, not affiliated with Howard University. Always confirm with the official map.
    </p>
  );
}
