import { useSyncExternalStore } from "react";

/** Usability-session notes live in their own key; resetting them never touches projects or a11y prefs. */
export const USABILITY_KEY = "yard-studio-usability-v1";

export type Verification = "auto" | "self-report";
export interface Scenario { id: string; title: string; instructions: string; verification: Verification; destination: "/settings" | "/editor" | "/map" | "/reviews" | "/studios"; }

export const A11Y_SCENARIOS: Scenario[] = [
  { id: "speech-on", title: "Turn on spoken confirmations", instructions: "Open Accessibility Settings and switch on spoken action confirmations. Use Test voice separately if supported.", verification: "auto", destination: "/settings" },
  { id: "audio-text", title: "Confirm an action by audio and text", instructions: "With speech on, save a version in the Design Editor. Check that you hear the confirmation AND see the on-screen message.", verification: "self-report", destination: "/editor" },
  { id: "typography", title: "Adjust text size or spacing", instructions: "Change the text size or turn on increased text spacing. Then check readability on two pages; only the setting change is automatically tracked.", verification: "auto", destination: "/settings" },
  { id: "keyboard", title: "Keyboard-only workflow", instructions: "Without a mouse, use Tab, Shift+Tab, Enter and Space to open a review and post feedback. Note any place focus was lost or hidden.", verification: "self-report", destination: "/reviews" },
  { id: "assistive-tech", title: "Assistive technology check", instructions: "With NVDA, VoiceOver or TalkBack running, navigate the app and create a project. Note anything that was not announced or was confusing.", verification: "self-report", destination: "/studios" },
  { id: "map-directory", title: "Find a building without the map", instructions: "On the Area Map, use only the searchable building list to find Founders Library and open its details.", verification: "auto", destination: "/map" },
];

export type Ease = "" | "1" | "2" | "3" | "4" | "5";

/** Positive statements use one consistent five-point agreement scale. */
export const POST_SURVEY_QUESTIONS = [
  { id: "overall", text: "Overall, Yard Studio was easy to use." },
  { id: "navigation", text: "It was easy to find the pages and tools I needed." },
  { id: "instructions", text: "The labels and instructions were clear." },
  { id: "readability", text: "The text and controls were easy to see and read." },
  { id: "feedback", text: "I could tell when my actions were successful." },
  { id: "independence", text: "I was able to complete the tasks without help." },
  { id: "confidence", text: "I would feel confident using Yard Studio on my own." },
] as const;

export type PostQuestionId = (typeof POST_SURVEY_QUESTIONS)[number]["id"];
export interface ScenarioRecord { done: boolean; ease: Ease; notes: string; }
export interface UsabilityState {
  version: 1;
  consent: boolean;
  participantCode: string;
  scenarios: Record<string, ScenarioRecord>;
  missionNotes: Record<string, { ease: Ease; notes: string }>;
  post: { overall: Ease; ratings: Partial<Record<PostQuestionId, Ease>>; liked: string; confusing: string; };
}

export const emptyUsability = (): UsabilityState => ({
  version: 1, consent: false, participantCode: "", scenarios: {}, missionNotes: {}, post: { overall: "", ratings: {}, liked: "", confusing: "" },
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
    st = p && p.version === 1 ? { ...emptyUsability(), ...p, post: { ...emptyUsability().post, ...(p.post ?? {}) } } : emptyUsability();
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
  setConsent(v: boolean) { save(v ? { ...load(), consent: true } : emptyUsability()); },
  setParticipant(code: string) { save({ ...load(), participantCode: code.slice(0, 40) }); },
  patchScenario(id: string, patch: Partial<ScenarioRecord>) { const s = load(); save({ ...s, scenarios: { ...s.scenarios, [id]: { ...rec(s, id), ...patch } } }); },
  /** Only for automatically observable scenarios; never called for self-report ones. */
  markAuto(id: string) {
    const sc = A11Y_SCENARIOS.find((x) => x.id === id);
    if (!sc || sc.verification !== "auto" || typeof window === "undefined") return;
    const s = load();
    if (!s.consent || rec(s, id).done) return;
    save({ ...s, scenarios: { ...s.scenarios, [id]: { ...rec(s, id), done: true } } });
  },
  patchMission(key: string, patch: Partial<{ ease: Ease; notes: string }>) { const s = load(); const cur = s.missionNotes[key] ?? { ease: "", notes: "" }; save({ ...s, missionNotes: { ...s.missionNotes, [key]: { ...cur, ...patch } } }); },
  patchPost(patch: Partial<UsabilityState["post"]>) { const s = load(); if (!s.consent) return; save({ ...s, post: { ...s.post, ...patch } }); },
  patchPostRating(id: PostQuestionId, rating: Ease) {
    const s = load();
    if (!s.consent) return;
    if (id === "overall") {
      save({ ...s, post: { ...s.post, overall: rating } });
    } else {
      save({ ...s, post: { ...s.post, ratings: { ...s.post.ratings, [id]: rating } } });
    }
  },
  reset() { save(emptyUsability()); },
};

// Guard against spreadsheet formula injection when opening participant-supplied text in Excel/Sheets.
const csvCell = (v: string | number | boolean) => {
  const str = String(v);
  const safe = /^[=+@\-\t\r]/.test(str) ? "'" + str : str;
  return `"${safe.replace(/"/g, '""')}"`;
};

export function exportRows(u: UsabilityState, missions: { key: string; title: string; done: boolean }[]) {
  const rows: (string | number | boolean)[][] = [["type", "id", "title", "verification", "completed", "ease_1to5", "notes"]];
  rows.push(["session", "participant_code", "Anonymous session code", "self-report", "", "", u.participantCode]);
  for (const m of missions) { const n = u.missionNotes[m.key] ?? { ease: "", notes: "" }; rows.push(["mission", m.key, m.title, "auto", m.done, n.ease, n.notes]); }
  for (const s of A11Y_SCENARIOS) { const r = rec(u, s.id); rows.push(["scenario", s.id, s.title, s.verification, r.done, r.ease, r.notes]); }
  for (const q of POST_SURVEY_QUESTIONS) {
    const rating = q.id === "overall" ? u.post.overall : (u.post.ratings?.[q.id] ?? "");
    rows.push(["posttest", q.id, q.text, "self-report", "", rating, ""]);
  }
  rows.push(["posttest", "liked", "What worked well", "self-report", "", "", u.post.liked]);
  rows.push(["posttest", "confusing", "What was confusing", "self-report", "", "", u.post.confusing]);
  return rows;
}
export const toCSV = (rows: (string | number | boolean)[][]) => rows.map((r) => r.map(csvCell).join(",")).join("\n");
