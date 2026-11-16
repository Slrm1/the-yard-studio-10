import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { Volume2, Square, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePrefs, setPrefs, resetPrefs, type A11yPrefs, type TextSize } from "@/lib/a11y-prefs";
import { listVoices, speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { announce, notify } from "@/lib/announce";
import { usability } from "@/lib/usability";
import { useHydrated } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Accessibility Settings — The Yard Studio" },
    { name: "description", content: "Spoken confirmations, high contrast, text size, focus, motion and spacing options for The Yard Studio." },
    { property: "og:title", content: "Accessibility Settings — The Yard Studio" },
    { property: "og:description", content: "Make The Yard Studio easier to see, hear and use." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: SettingsPage,
});

const LABELS: Partial<Record<keyof A11yPrefs, string>> = {
  speakActions: "Spoken action confirmations", speakNavigation: "Spoken page-change confirmations",
  highContrast: "High contrast", largeTargets: "Larger buttons", strongFocus: "Enhanced focus outline",
  reduceMotion: "Reduced motion", textSpacing: "Increased text spacing",
};

function update(patch: Partial<A11yPrefs>, message: string) {
  const ok = setPrefs(patch);
  if (patch.speakActions) usability.markAuto("speech-on");
  if (patch.textSize !== undefined || patch.textSpacing !== undefined) usability.markAuto("typography");
  if (!ok) { notify.error("Setting applied for now, but this browser blocked saving it."); return; }
  announce(message);
}

function Toggle({ k, help }: { k: keyof A11yPrefs; help: string }) {
  const p = usePrefs();
  const id = useId();
  const on = p[k] as boolean;
  return (
    <div className="flex items-start justify-between gap-4 border-b py-4 last:border-0">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-base font-semibold">{LABELS[k]}</Label>
        <p id={id + "-help"} className="mt-1 text-sm text-muted-foreground">{help}</p>
      </div>
      <Switch id={id} checked={on} aria-describedby={id + "-help"} className="mt-1 shrink-0"
        onCheckedChange={(v) => update({ [k]: v } as Partial<A11yPrefs>, `${LABELS[k]} ${v ? "enabled" : "disabled"}`)} />
    </div>
  );
}

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-md border-2 border-ink bg-card p-5 shadow-block">
      <h2 id={id} className="font-display text-2xl text-navy">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const p = usePrefs();
  const hydrated = useHydrated();
  const supported = hydrated && speechSupported();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!speechSupported()) return;
    const load = () => setVoices(listVoices());
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", load);
  }, []);
  const active = Object.entries(LABELS).filter(([k]) => p[k as keyof A11yPrefs] === true).map(([, l]) => l);
  if (p.textSize !== "default") active.push(p.textSize === "large" ? "Large text" : "Extra large text");

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Your preferences · saved in this browser only" title="Accessibility settings">
        Adjust how The Yard Studio looks, sounds and responds. These settings are stored separately from your projects, so changing or resetting them never deletes your work.
      </PageHeader>

      <p className="mb-6 rounded-md border bg-cream p-4 text-sm" aria-live="polite">
        <strong>Active now:</strong> {hydrated ? (active.length ? active.join(", ") : "Default settings") : "Loading your settings…"}
      </p>

      <div className="space-y-6">
        <Section title="Spoken confirmations" id="speech">
          {!supported && hydrated && <p className="mb-3 rounded-md border-2 border-cardinal p-3 text-sm" role="note">This browser does not support speech output. Visual and screen-reader messages still work.</p>}
          <Toggle k="speakActions" help="Off by default. Reads short outcomes aloud, such as “Version saved in this browser”. It never reads what you type or private text." />
          <Toggle k="speakNavigation" help="Reads the page name after you move to a new page." />
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="rate" className="font-semibold">Speech rate: {p.speechRate.toFixed(1)}×</Label>
              <input id="rate" type="range" min={0.5} max={2} step={0.1} value={p.speechRate} disabled={!supported}
                onChange={(e) => setPrefs({ speechRate: Number(e.target.value) })} className="mt-2 block h-11 w-full accent-[var(--navy)]" />
            </div>
            <div>
              <Label htmlFor="vol" className="font-semibold">Speech volume: {Math.round(p.speechVolume * 100)}%</Label>
              <input id="vol" type="range" min={0} max={1} step={0.1} value={p.speechVolume} disabled={!supported}
                onChange={(e) => setPrefs({ speechVolume: Number(e.target.value) })} className="mt-2 block h-11 w-full accent-[var(--navy)]" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="voice" className="font-semibold">Voice</Label>
              <select id="voice" value={p.voiceURI ?? ""} disabled={!supported || !voices.length}
                onChange={(e) => update({ voiceURI: e.target.value || null }, "Voice changed")}
                className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm">
                <option value="">Browser default</option>
                {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
              </select>
              {supported && !voices.length && <p className="mt-1 text-xs text-muted-foreground">No voice list available yet; the browser default will be used.</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="cardinal" disabled={!supported} onClick={() => { if (speak("This is The Yard Studio test voice.", "test")) announce("Playing test voice", { speech: false }); }}><Volume2 aria-hidden /> Test voice</Button>
            <Button variant="outline" disabled={!supported} onClick={() => { stopSpeaking(); announce("Speech stopped", { speech: false }); }}><Square aria-hidden /> Stop speaking</Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Using a screen reader (NVDA, JAWS, VoiceOver, TalkBack)? It works on its own and already hears every confirmation through on-page status messages. You can leave spoken confirmations off to avoid hearing things twice.
          </p>
        </Section>

        <Section title="Display" id="display">
          <Toggle k="highContrast" help="Darker text and borders and stronger link underlines." />
          <fieldset className="border-b py-4">
            <legend className="text-base font-semibold">Text size</legend>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Text size">
              {([["default", "Default"], ["large", "Large"], ["xlarge", "Extra large"]] as [TextSize, string][]).map(([v, l]) => (
                <label key={v} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-2 px-4 has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-paper">
                  <input type="radio" name="text-size" value={v} checked={p.textSize === v} onChange={() => update({ textSize: v }, `Text size set to ${l}`)} className="h-4 w-4" />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
          <Toggle k="textSpacing" help="More space between letters, words and lines." />
          <Toggle k="largeTargets" help="Makes buttons and links at least 44 by 44 pixels." />
          <Toggle k="strongFocus" help="A thicker, two-colour outline shows where the keyboard is." />
          <Toggle k="reduceMotion" help="Turns off animations. Your device’s reduce-motion setting is always respected too." />
        </Section>

        <section className="rounded-md border bg-cream p-5">
          <h2 className="font-display text-2xl text-navy">Reset</h2>
          <p className="mt-1 text-sm text-muted-foreground">Restores these accessibility settings only. Projects, reviews and organizations are not touched.</p>
          <Button className="mt-3" variant="outline" onClick={() => { stopSpeaking(); const ok = resetPrefs(); if (ok) announce("Accessibility settings reset to defaults", { speech: false }); else notify.error("Could not clear saved settings in this browser."); }}><RotateCcw aria-hidden /> Reset accessibility settings</Button>
        </section>
      </div>
    </div>
  );
}
