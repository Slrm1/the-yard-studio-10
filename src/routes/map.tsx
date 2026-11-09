import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/brand";
import { DataSourceNote, LandmarkDirectory, MapPanel, OfficialMapLink } from "@/components/campus-ui";
import { OFFICIAL_MAP_URL } from "@/lib/campus";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [
    { title: "Howard Campus Map — The Yard Studio" },
    { name: "description", content: "Geographic map of Howard University's central campus with a searchable building directory." },
    { property: "og:title", content: "Howard Campus Map — The Yard Studio" },
    { property: "og:description", content: "Search and explore verified Howard University landmarks." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: MapPage,
});

function MapPage() {
  const [sel, setSel] = useState<string | null>("founders");
  const [embed, setEmbed] = useState(false);
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Washington, DC · central campus" title="Area map" actions={<OfficialMapLink />}>
        A real geographic map of Howard University. Select a building in the list or on the map.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <MapPanel selectedId={sel} onSelect={setSel} className="h-[55vh] min-h-[320px] lg:h-[640px]" />
        <aside aria-label="Building directory"><LandmarkDirectory selectedId={sel} onSelect={setSel} /></aside>
      </div>
      <section className="mt-10" aria-labelledby="official">
        <h2 id="official" className="font-display text-3xl text-navy">Official Howard campus map</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Howard publishes an interactive map. You can load it here, or open it in a new tab if it doesn’t appear.</p>
        {embed ? (
          <iframe title="Howard University Central Campus Map (official)" src={OFFICIAL_MAP_URL} className="mt-4 h-[70vh] w-full rounded-md border-2 border-ink bg-card" loading="lazy" />
        ) : (
          <button type="button" onClick={() => setEmbed(true)} className="mt-4 min-h-11 rounded-md border-2 border-ink bg-card px-4 font-semibold hover:bg-accent">Load the official map here</button>
        )}
      </section>
      <DataSourceNote />
    </div>
  );
}
