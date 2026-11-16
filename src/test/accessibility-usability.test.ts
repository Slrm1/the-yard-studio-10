import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  __resetPrefsCache, DEFAULT_PREFS, PREFS_KEY, getPrefs, resetPrefs,
  sanitizePrefs, setPrefs,
} from "@/lib/a11y-prefs";
import {
  __resetUsabilityCache, A11Y_SCENARIOS, USABILITY_KEY, getUsability, usability,
  toCSV, exportRows,
} from "@/lib/usability";
import { __resetSpeechDedup, speak, speechSupported, stopSpeaking } from "@/lib/speech";

beforeEach(() => {
  window.localStorage.clear();
  __resetPrefsCache();
  __resetUsabilityCache();
  __resetSpeechDedup();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Accessibility preferences", () => {
  it("defaults to speech off and safe appearance options", () => {
    expect(getPrefs().speakActions).toBe(false);
    expect(getPrefs().speakNavigation).toBe(false);
    expect(getPrefs().textSize).toBe("default");
  });
  it("sanitizes untrusted stored preferences", () => {
    const bad = sanitizePrefs({ version: 1, speechRate: 99, speechVolume: -7, textSize: "giant", speakActions: "true" });
    expect(bad.speechRate).toBe(2);
    expect(bad.speechVolume).toBe(0);
    expect(bad.textSize).toBe("default");
    expect(bad.speakActions).toBe(false);
    expect(sanitizePrefs({ version: 999 })).toEqual(DEFAULT_PREFS);
  });
  it("persists settings separately and reset does not erase project data", () => {
    window.localStorage.setItem("yard-studio-state-v1", '{"project":"keep"}');
    expect(setPrefs({ speakActions: true, highContrast: true, textSize: "large" })).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(PREFS_KEY) || "{}").highContrast).toBe(true);
    __resetPrefsCache();
    expect(getPrefs().textSize).toBe("large");
    expect(resetPrefs()).toBe(true);
    expect(getPrefs().speakActions).toBe(false);
    expect(window.localStorage.getItem("yard-studio-state-v1")).toBe('{"project":"keep"}');
  });
  it("does not claim a settings write succeeded when localStorage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(setPrefs({ highContrast: true })).toBe(false);
    expect(getPrefs().highContrast).toBe(true);
  });
});

describe("Spoken feedback", () => {
  it("fails gracefully when Web Speech is unavailable", () => {
    vi.stubGlobal("speechSynthesis", undefined);
    vi.stubGlobal("SpeechSynthesisUtterance", undefined);
    expect(speechSupported()).toBe(false);
    expect(speak("Version saved", "test")).toBe(false);
    expect(() => stopSpeaking()).not.toThrow();
  });
  it("keeps action confirmations off until opted in, then deduplicates repeat actions", () => {
    const synth = { cancel: vi.fn(), speak: vi.fn(), getVoices: vi.fn(() => []) };
    class Utterance {
      rate = 1;
      volume = 1;
      voice: unknown = null;
      constructor(public text: string) {}
    }
    vi.stubGlobal("speechSynthesis", synth);
    vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
    expect(speak("Project saved")).toBe(false);
    setPrefs({ speakActions: true });
    expect(speak("Project saved")).toBe(true);
    expect(synth.speak).toHaveBeenCalledTimes(1);
    expect(speak("Project saved")).toBe(false);
    setPrefs({ speakActions: false });
    expect(speak("Another confirmation")).toBe(false);
  });
});

describe("Local usability study", () => {
  it("preserves the original project store and keeps scenario notes separate", () => {
    window.localStorage.setItem("yard-studio-state-v1", "project-data");
    usability.setConsent(true);
    usability.setParticipant("Test-01");
    usability.patchMission("springfestCreated", { ease: "4", notes: "Easy to find" });
    expect(window.localStorage.getItem(USABILITY_KEY)).toContain("Test-01");
    expect(window.localStorage.getItem("yard-studio-state-v1")).toBe("project-data");
    usability.reset();
    expect(getUsability().consent).toBe(false);
    expect(window.localStorage.getItem("yard-studio-state-v1")).toBe("project-data");
  });
  it("never auto-reports a task before consent or self-reports external assistive technology", () => {
    usability.markAuto("speech-on");
    expect(getUsability().scenarios["speech-on"]).toBeUndefined();
    usability.setConsent(true);
    usability.markAuto("speech-on");
    expect(getUsability().scenarios["speech-on"].done).toBe(true);
    usability.markAuto("assistive-tech");
    expect(getUsability().scenarios["assistive-tech"]).toBeUndefined();
    expect(A11Y_SCENARIOS.find((s) => s.id === "assistive-tech")?.verification).toBe("self-report");
  });
  it("withdrawal of consent clears stored study feedback", () => {
    usability.setConsent(true);
    usability.patchScenario("keyboard", { done: true, notes: "Some feedback" });
    usability.setParticipant("T2");
    usability.setConsent(false);
    expect(getUsability().participantCode).toBe("");
    expect(getUsability().scenarios).toEqual({});
  });
  it("exports a CSV with escaped and formula-safe participant notes", () => {
    usability.setConsent(true);
    usability.patchPost({ confusing: '=HYPERLINK("bad")' });
    const csv = toCSV(exportRows(getUsability(), [{ key: "springfestCreated", title: "Create project", done: true }]));
    expect(csv).toContain('"mission","springfestCreated"');
    expect(csv).toContain("\"'=HYPERLINK(\"\"bad\"\")\"");
    expect(csv).toContain('"session","participant_code"');
  });
});
