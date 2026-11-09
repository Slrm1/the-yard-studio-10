import { useEffect, useRef } from "react";
import { CAMPUS_CENTER, LANDMARKS, pinned } from "@/lib/campus";


type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  recenterKey: number;
  /** Optional simulated marker placed exactly on a landmark point (never between). */
  simAtId?: string | null;
  simLabel?: string;
  highlightIds?: string[];
};

/** Browser-only Leaflet map. Import lazily from routes. */
export default function CampusMap({ selectedId, onSelect, recenterKey, simAtId, simLabel = "SIM", highlightIds }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      const L = (mod as unknown as { default?: typeof import("leaflet") }).default ?? mod;
      if (cancelled || !el.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(el.current, { center: CAMPUS_CENTER, zoom: 17, scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      draw();
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const L = LRef.current, layer = layerRef.current, map = mapRef.current;
    if (!L || !layer || !map) return;
    layer.clearLayers();
    LANDMARKS.filter(pinned).forEach((l) => {
      const sel = l.id === selectedId;
      const hi = highlightIds?.includes(l.id);
      const icon = L.divIcon({
        className: "yard-pin",
        html: `<span style="display:grid;place-items:center;width:${sel ? 34 : 26}px;height:${sel ? 34 : 26}px;border-radius:9999px;border:3px solid var(--paper);background:${sel ? "var(--cardinal)" : hi ? "var(--gold)" : "var(--navy)"};box-shadow:0 2px 6px rgb(0 0 0/.4)"></span>`,
        iconSize: [sel ? 34 : 26, sel ? 34 : 26],
        iconAnchor: [sel ? 17 : 13, sel ? 17 : 13],
      });
      L.marker([l.lat, l.lng], { icon, title: l.name, alt: l.name, keyboard: true })
        .addTo(layer)
        .bindTooltip(l.name, { direction: "top", offset: [0, -14] })
        .on("click", () => onSelectRef.current(l.id));
    });
    const sim = LANDMARKS.find((l) => l.id === simAtId);
    if (sim && pinned(sim)) {
      const icon = L.divIcon({
        className: "yard-pin",
        html: `<span style="display:inline-block;padding:2px 6px;border:2px solid var(--alert-ink);background:var(--alert);color:var(--alert-ink);font:700 11px/1.2 var(--font-mono);white-space:nowrap">🤖 ${simLabel}</span>`,
        iconSize: [90, 22],
        iconAnchor: [45, 40],
      });
      L.marker([sim.lat, sim.lng], { icon, interactive: false, keyboard: false }).addTo(layer);
    }
  }

  useEffect(() => {
    draw();
    const l = LANDMARKS.find((x) => x.id === selectedId);
    if (l && pinned(l)) mapRef.current?.panTo([l.lat, l.lng]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, simAtId, highlightIds?.join(",")]);

  useEffect(() => {
    if (recenterKey) mapRef.current?.setView(CAMPUS_CENTER, 17);
  }, [recenterKey]);

  return <div ref={el} className="h-full min-h-[320px] w-full" role="region" aria-label="Geographic map of Howard University central campus (OpenStreetMap)" />;
}
