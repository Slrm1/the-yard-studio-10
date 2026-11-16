import { toast } from "sonner";
import { speak, type SpeakKind } from "./speech";
import { storageError } from "./store";

/** Shared announcement channel: visible toast + polite/assertive live region + optional speech. */
export interface Announcement { id: number; text: string; politeness: "polite" | "assertive" }

let seq = 0;
let current: Announcement = { id: 0, text: "", politeness: "polite" };
const listeners = new Set<(a: Announcement) => void>();

export function onAnnounce(l: (a: Announcement) => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}
export function lastAnnouncement() { return current; }

/** Live region + optional speech only (no toast). */
export function announce(text: string, opts: { politeness?: "polite" | "assertive"; speech?: SpeakKind | false } = {}) {
  current = { id: ++seq, text, politeness: opts.politeness ?? "polite" };
  listeners.forEach((l) => l(current));
  if (opts.speech !== false) speak(text, opts.speech ?? "action");
}

const STORAGE_FAIL = "Not saved: this browser blocked storage. Your change will be lost on refresh.";

export const notify = {
  /** Call AFTER the store action. Reports failure instead of success if storage write failed. */
  success(text: string) {
    if (storageError) {
      notify.error(STORAGE_FAIL);
      return false;
    }
    toast.success(text);
    announce(text);
    return true;
  },
  error(text: string) {
    toast.error(text);
    announce(text, { politeness: "assertive" });
    return false;
  },
  info(text: string) {
    toast(text);
    announce(text);
  },
};
