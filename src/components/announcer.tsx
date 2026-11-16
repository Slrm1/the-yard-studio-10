import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { onAnnounce, announce, type Announcement } from "@/lib/announce";
import { applyPrefsToDocument, getPrefs, usePrefs } from "@/lib/a11y-prefs";
import { stopSpeaking } from "@/lib/speech";

/** Two live regions (polite, assertive). Text is cleared then set so repeats are re-announced. */
export function LiveAnnouncer() {
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");
  useEffect(() => onAnnounce((a: Announcement) => {
    const setter = a.politeness === "assertive" ? setAssertive : setPolite;
    setter("");
    window.setTimeout(() => setter(a.text), 60);
  }), []);
  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" data-testid="live-polite">{polite}</div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only" data-testid="live-assertive">{assertive}</div>
    </>
  );
}

/** Applies stored prefs after hydration, cancels speech when turned off, and moves focus to the page heading on navigation. */
export function A11yRuntime() {
  const p = usePrefs();
  useEffect(() => { applyPrefsToDocument(getPrefs()); }, []);
  useEffect(() => { if (!p.speakActions && !p.speakNavigation) stopSpeaking(); }, [p.speakActions, p.speakNavigation]);
  useEffect(() => () => stopSpeaking(), []);

  const path = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = window.setTimeout(() => {
      const h = document.querySelector<HTMLElement>("main h1");
      if (h) {
        h.setAttribute("tabindex", "-1");
        h.focus({ preventScroll: false });
      }
      const title = h?.textContent?.trim() || document.title;
      announce(`Page: ${title}`, { speech: "navigation" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [path]);
  return null;
}
