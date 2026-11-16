import { useSyncExternalStore } from "react";

/** Usability-session notes live in their own key; resetting them never touches projects or a11y prefs. */
export const USABILITY_KEY = "yard-studio-usability-v1";

export type Verification = "auto" | "self-report";
export interface Scenario { id: string; title: string; instructions: string; verification: Verification; destination: "/settings" | "/editor" | "/map" | "/reviews" | "/studios"; }

export const A11Y_SCENARIOS: Scenario[] = [
  { id: "speech-on", title: "Turn on spoken confirmations", instructions: "Open Accessibility Settings and switch on “Speak action confirmations”. Press Test voice.", verification: "auto", destination: "/settings" },
  { id: "audio-text", title: "Confirm an action by audio and text", instructions: "With speech on, save a version in the Design Editor. Check that you hear the confirmation AND see the on-screen message.", verification: "self-report", destination: "/editor" },
  { id: "typography", title: "Adjust text size or spacing", instructions: "Change the text size or turn on increased text spacing, then browse two pages.", verification: "auto", destination: "/settings" },
  { id: "keyboard", title: "Keyboard-only workflow", instructions: "Without a mouse, use Tab, Shift+Tab, Enter and Space to open a review and post feedback. Note any place focus was lost or hidden.", verification: "self-report", destination: "/reviews" },
  { id: "assistive-tech", title: "Assistive technology check", instructions: "With NVDA, VoiceOver or TalkBack running, navigate the app and create a project. Note anything that was not announced or was confusing.", verification: "self-report", destination: "/studios" },
  { id: "map-directory", title: "Find a building without the map", instructions: "On the Area Map, use only the searchable building list to find Founders Library and open its details.", verification: "auto", destination: "/map" },
];

export type Ease = "" | "1" | "2" | "3" | "4" | "5";
export interface ScenarioRecord { done: boolean; ease: Ease; notes: string; }
export interface UsabilityState {
  version: 1;
  consent: boolean;
  participantCode: string;
  scenarios: Record<string, ScenarioRecord>;
  missionNotes: Record<string, { ease: Ease; notes: string }>;
  post: { overall: Ease; liked: string; confusing: string; };
}

export const emptyUsability = (): UsabilityState => ({
  version: 1, consent: false, participantCode: "", scenarios: {}, missionNotes: {}, post: { overall: "", liked: "", confusing: "" },
});

let st: UsabilityState | null = null;
const ls = new Set<() => void>();
let serverSnap: UsabilityState | null = null;
const server = () => (serverSnap ??= emptyUsability());

function load(): UsabilityState {
  if (st) return st;
  if (typeof window === "undefined") return server();
  try {
    const raw = window.localStorage.getItem(USABILITY_KEY);
    const p = raw ? JSON.parse(raw) : null;
    st = p && p.version === 1 ? { ...emptyUsability(), ...p } : emptyUsability();
  } catch { st = emptyUsability(); }
  return st!;
}
export let usabilityStorageError = false;
function save(next: UsabilityState) {
  st = next;
  try { window.localStorage.setItem(USABILITY_KEY, JSON.stringify(next)); usabilityStorageError = false; } catch { usabilityStorageError = true; }
  ls.forEach((l) => l());
}
export const useUsability = () => useSyncExternalStore((l) => { ls.add(l); return () => { ls.delete(l); }; }, load, server);
export const getUsability = load;
export const __resetUsabilityCache = () => { st = null; };

const rec = (s: UsabilityState, id: string): ScenarioRecord => s.scenarios[id] ?? { done: false, ease: "", notes: "" };

export const usability = {
  setConsent(v: boolean) { save({ ...load(), consent: v }); },
  setParticipant(code: string) { save({ ...load(), participantCode: code.slice(0, 40) }); },
  patchScenario(id: string, patch: Partial<ScenarioRecord>) { const s = load(); save({ ...s, scenarios: { ...s.scenarios, [id]: { ...rec(s, id), ...patch } } }); },
  /** Only for automatically observable scenarios; never called for self-report ones. */
  markAuto(id: string) {
    const sc = A11Y_SCENARIOS.find((x) => x.id === id);
    if (!sc || sc.verification !== "auto" || typeof window === "undefined") return;
    const s = load();
    if (rec(s, id).done) return;
    save({ ...s, scenarios: { ...s.scenarios, [id]: { ...rec(s, id), done: true } } });
  },
  patchMission(key: string, patch: Partial<{ ease: Ease; notes: string }>) { const s = load(); const cur = s.missionNotes[key] ?? { ease: "", notes: "" }; save({ ...s, missionNotes: { ...s.missionNotes, [key]: { ...cur, ...patch } } }); },
  patchPost(patch: Partial<UsabilityState["post"]>) { const s = load(); save({ ...s, post: { ...s.post, ...patch } }); },
  reset() { save(emptyUsability()); },
};

const csvCell = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`;

export function exportRows(u: UsabilityState, missions: { key: string; title: string; done: boolean }[]) {
  const rows: (string | number | boolean)[][] = [["type", "id", "title", "verification", "completed", "ease_1to5", "notes"]];
  for (const m of missions) { const n = u.missionNotes[m.key] ?? { ease: "", notes: "" }; rows.push(["mission", m.key, m.title, "auto", m.done, n.ease, n.notes]); }
  for (const s of A11Y_SCENARIOS) { const r = rec(u, s.id); rows.push(["scenario", s.id, s.title, s.verification, r.done, r.ease, r.notes]); }
  rows.push(["posttest", "overall", "Overall ease", "self-report", "", u.post.overall, ""]);
  rows.push(["posttest", "liked", "What worked well", "self-report", "", "", u.post.liked]);
  rows.push(["posttest", "confusing", "What was confusing", "self-report", "", "", u.post.confusing]);
  return rows;
}
export const toCSV = (rows: (string | number | boolean)[][]) => rows.map((r) => r.map(csvCell).join(",")).join("\n");
