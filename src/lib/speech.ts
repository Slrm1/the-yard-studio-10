import { getPrefs } from "./a11y-prefs";

/** Browser-only wrapper around speechSynthesis. Every call is a no-op when unsupported or disabled. */
export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
}

let lastText = "";
let lastAt = 0;

export function stopSpeaking() {
  if (!speechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

export function listVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  try {
    return window.speechSynthesis.getVoices();
  } catch {
    return [];
  }
}

export type SpeakKind = "action" | "navigation" | "test";

/**
 * Speak a short outcome message. Returns true only if an utterance was queued.
 * Duplicate text within 1.5s is dropped; a new message cancels the previous one.
 */
export function speak(text: string, kind: SpeakKind = "action"): boolean {
  const p = getPrefs();
  if (kind === "action" && !p.speakActions) return false;
  if (kind === "navigation" && !p.speakNavigation) return false;
  if (!speechSupported() || !text.trim()) return false;
  const now = Date.now();
  if (kind !== "test" && text === lastText && now - lastAt < 1500) return false;
  lastText = text;
  lastAt = now;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new window.SpeechSynthesisUtterance(text);
    u.rate = p.speechRate;
    u.volume = p.speechVolume;
    if (p.voiceURI) {
      const v = synth.getVoices().find((x) => x.voiceURI === p.voiceURI);
      if (v) u.voice = v;
    }
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function __resetSpeechDedup() {
  lastText = "";
  lastAt = 0;
}
