import { useSyncExternalStore } from "react";

/** Accessibility preferences live in their own versioned key so resetting them never touches project data. */
export const PREFS_KEY = "yard-studio-a11y-v1";

export type TextSize = "default" | "large" | "xlarge";
export interface A11yPrefs {
  version: 1;
  speakActions: boolean;
  speakNavigation: boolean;
  speechRate: number; // 0.5 – 2
  speechVolume: number; // 0 – 1
  voiceURI: string | null;
  highContrast: boolean;
  textSize: TextSize;
  largeTargets: boolean;
  strongFocus: boolean;
  reduceMotion: boolean;
  textSpacing: boolean;
}

export const DEFAULT_PREFS: A11yPrefs = {
  version: 1,
  speakActions: false,
  speakNavigation: false,
  speechRate: 1,
  speechVolume: 1,
  voiceURI: null,
  highContrast: false,
  textSize: "default",
  largeTargets: false,
  strongFocus: false,
  reduceMotion: false,
  textSpacing: false,
};

const clamp = (n: unknown, lo: number, hi: number, d: number) =>
  typeof n === "number" && Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d;

export function sanitizePrefs(raw: unknown): A11yPrefs {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_PREFS };
  const r = raw as Record<string, unknown>;
  if (r["version"] !== 1) return { ...DEFAULT_PREFS };
  const b = (k: keyof A11yPrefs) => (typeof r[k] === "boolean" ? (r[k] as boolean) : (DEFAULT_PREFS[k] as boolean));
  const ts = r["textSize"];
  return {
    version: 1,
    speakActions: b("speakActions"),
    speakNavigation: b("speakNavigation"),
    speechRate: clamp(r["speechRate"], 0.5, 2, 1),
    speechVolume: clamp(r["speechVolume"], 0, 1, 1),
    voiceURI: typeof r["voiceURI"] === "string" ? (r["voiceURI"] as string) : null,
    highContrast: b("highContrast"),
    textSize: ts === "large" || ts === "xlarge" ? ts : "default",
    largeTargets: b("largeTargets"),
    strongFocus: b("strongFocus"),
    reduceMotion: b("reduceMotion"),
    textSpacing: b("textSpacing"),
  };
}

let prefs: A11yPrefs | null = null;
const listeners = new Set<() => void>();
export let prefsStorageError = false;

function load(): A11yPrefs {
  if (prefs) return prefs;
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    prefs = raw ? sanitizePrefs(JSON.parse(raw)) : { ...DEFAULT_PREFS };
  } catch {
    prefs = { ...DEFAULT_PREFS };
  }
  return prefs;
}

export function getPrefs(): A11yPrefs {
  return load();
}

/** Returns false when the browser refused to store the change. */
export function setPrefs(patch: Partial<A11yPrefs>): boolean {
  prefs = sanitizePrefs({ ...load(), ...patch, version: 1 });
  let ok = true;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    ok = false;
  }
  prefsStorageError = !ok;
  applyPrefsToDocument(prefs);
  listeners.forEach((l) => l());
  return ok;
}

export function resetPrefs(): boolean {
  prefs = { ...DEFAULT_PREFS };
  let ok = true;
  try {
    window.localStorage.removeItem(PREFS_KEY);
  } catch {
    ok = false;
  }
  applyPrefsToDocument(prefs);
  listeners.forEach((l) => l());
  return ok;
}

/** Test helper: forget in-memory cache so the next read comes from storage. */
export function __resetPrefsCache() {
  prefs = null;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Server snapshot is always defaults, so first client render matches SSR; real prefs apply after hydration. */
export function usePrefs(): A11yPrefs {
  return useSyncExternalStore(subscribe, load, () => DEFAULT_PREFS);
}

export function applyPrefsToDocument(p: A11yPrefs) {
  if (typeof document === "undefined") return;
  const d = document.documentElement.dataset;
  d["contrast"] = p.highContrast ? "high" : "default";
  d["textSize"] = p.textSize;
  d["targets"] = p.largeTargets ? "large" : "default";
  d["focus"] = p.strongFocus ? "strong" : "default";
  d["motion"] = p.reduceMotion ? "reduce" : "default";
  d["spacing"] = p.textSpacing ? "wide" : "default";
}
