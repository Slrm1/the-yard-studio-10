import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, RotateCcw, ArrowRight, Download, ShieldCheck } from "lucide-react";
import { PageHeader, DemoBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { actions, useAppState } from "@/lib/store";
import type { TaskFlags } from "@/lib/model";
import {
  A11Y_SCENARIOS, POST_SURVEY_QUESTIONS, exportRows, toCSV, useUsability, usability, usabilityStorageError,
  type Ease, type Scenario, type PostQuestionId,
} from "@/lib/usability";
import { notify } from "@/lib/announce";
import { submitUsabilityToCloud } from "@/lib/survey-cloud";

export const Route = createFileRoute("/usability")({
  head: () => ({ meta: [
    { title: "Usability Test — The Yard Studio" },
    { name: "description", content: "Optional anonymous usability survey with local drafts and secure cloud submission." },
  ] }),
  component: Usability,
});

const MISSIONS: { key: keyof TaskFlags; number: string; title: string; description: string; destination: "/seasonal" | "/studios" | "/reviews"; cta: string }[] = [
  { key: "springfestCreated", number: "01", title: "Create a Spring Fest page", description: "Visit Seasonal Spaces and create a project with the Spring Fest template. The project is saved in this browser.", destination: "/seasonal", cta: "Go to Seasonal Spaces" },
  { key: "teammateInvited", number: "02", title: "Try a teammate invitation", description: "Open an Org Studio and record a simulated invite with a valid email. No real email will be sent.", destination: "/studios", cta: "Go to Org Studios" },
  { key: "husaOpened", number: "03", title: "Inspect a review request", description: "Open the HUSA Voting — mobile header change review and assess its readability.", destination: "/reviews", cta: "Open Review Queue" },
  { key: "feedbackLeft", number: "04", title: "Leave specific design feedback", description: "Add a comment to the HUSA mobile header request. Mention a concrete accessibility or UX improvement.", destination: "/reviews", cta: "Comment on the review" },
];

const EASE_OPTIONS: { value: Ease; label: string }[] = [
  { value: "", label: "Not rated" },
  { value: "1", label: "1 — Very difficult" },
  { value: "2", label: "2 — Difficult" },
  { value: "3", label: "3 — Neutral" },
  { value: "4", label: "4 — Easy" },
  { value: "5", label: "5 — Very easy" },
];

function EaseInput({ id, value, onChange, disabled = false }: { id: string; value: Ease; onChange: (v: Ease) => void; disabled?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold">How easy was this?</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as Ease)} disabled={disabled}
        className="mt-1 min-h-11 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60">
        {EASE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

const AGREEMENT_SCALE = [
  { value: "1", label: "Strongly disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neither agree nor disagree" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly agree" },
] as const;

function SurveyQuestion({ id, question, number, value, onChange, disabled }: {
  id: PostQuestionId; question: string; number: number; value: Ease;
  onChange: (v: Ease) => void; disabled: boolean;
}) {
  return (
    <fieldset disabled={disabled} className="min-w-0 rounded-lg border border-ink/15 bg-card px-3 pb-4 pt-3 shadow-sm disabled:opacity-65 sm:px-5 sm:py-4">
      <legend className="max-w-full px-1 text-base font-semibold leading-snug text-ink sm:text-lg">
        <span className="mr-2 font-mono text-xs font-bold tracking-wider text-cardinal">{String(number).padStart(2, "0")}</span>
        {question}
      </legend>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="eyebrow text-muted-foreground">Select one answer</span>
        <span className={"text-xs font-semibold " + (value ? "text-navy" : "text-muted-foreground")}>
          {value ? "Selected: " + value + " / 5" : "Not answered"}
        </span>
      </div>
      <div className="mt-3 grid min-w-0 grid-cols-5 gap-1 sm:gap-2" aria-label={"Rating for question " + number}>
        {AGREEMENT_SCALE.map(({ value: option, label }) => (
          <label key={option} className="min-w-0 cursor-pointer">
            <input type="radio" name={"post-rating-" + id} value={option}
              checked={value === option} onChange={() => onChange(option)}
              aria-label={option + " — " + label} className="peer sr-only" />
            <span aria-hidden="true" className="flex min-h-12 min-w-0 items-center justify-center rounded-md border-2 border-ink/20 bg-cream text-lg font-bold text-navy transition-colors hover:border-navy/50 peer-checked:border-navy peer-checked:bg-navy peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-4 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cardinal peer-disabled:cursor-not-allowed">
              {option}
            </span>
            <span aria-hidden="true" className="mt-1 hidden text-center text-[11px] leading-tight text-muted-foreground lg:block">{label}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground lg:hidden">
        <span>1 — Strongly disagree</span>
        <span>5 — Strongly agree</span>
      </div>
      {value && (
        <button type="button" className="mt-3 min-h-11 rounded-md px-1 text-xs font-semibold text-cardinal underline underline-offset-2 focus-visible:outline-2" onClick={() => onChange("")}>
          Clear answer
        </button>
      )}
    </fieldset>
  );
}

function ScenarioCard({ scenario, number, consent, locked }: { scenario: Scenario; number: number; consent: boolean; locked: boolean }) {
  const u = useUsability();
  const item = u.scenarios[scenario.id] ?? { done: false, ease: "" as Ease, notes: "" };
  const auto = scenario.verification === "auto";
  return (
    <article className="min-w-0 rounded-md border-2 border-ink bg-card p-5" aria-labelledby={"scenario-" + scenario.id}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="eyebrow text-cardinal">Accessibility task {number.toString().padStart(2, "0")}</span>
        <span className="text-xs font-semibold">{item.done ? "Completed" : "Not completed"} · {auto ? "Action tracked" : "Tester verified"}</span>
      </div>
      <h3 id={"scenario-" + scenario.id} className="font-display mt-3 text-2xl leading-tight text-navy">{scenario.title}</h3>
      <p className="mt-2 text-sm leading-relaxed">{scenario.instructions}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {auto ? "Only the specific observable app action is marked automatically; this is not proof of usability or accessibility." :
          "The participant must report whether they completed this task. This cannot be verified automatically."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button asChild size="sm" variant="outline"><Link to={scenario.destination}>Go to task <ArrowRight aria-hidden /></Link></Button>
        {!auto && (
          <label className="inline-flex min-h-11 items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={item.done} disabled={!consent || locked}
              onChange={(e) => usability.patchScenario(scenario.id, { done: e.target.checked })}
              className="h-5 w-5 accent-[var(--navy)]" />
            I completed this task
          </label>
        )}
      </div>
      {consent && (
        <div className="mt-4 space-y-3 border-t pt-4">
          <EaseInput id={"ease-" + scenario.id} value={item.ease} onChange={(ease) => usability.patchScenario(scenario.id, { ease })} disabled={locked} />
          <div>
            <label htmlFor={"notes-" + scenario.id} className="block text-xs font-semibold">Problems, confusion or feedback (optional)</label>
            <textarea id={"notes-" + scenario.id} maxLength={1000} rows={2} value={item.notes} disabled={locked}
              onChange={(e) => usability.patchScenario(scenario.id, { notes: e.target.value })}
              className="mt-1 w-full rounded-md border bg-background p-3 text-sm" placeholder="Describe what happened; don't enter names or private details." />
          </div>
        </div>
      )}
    </article>
  );
}

function Usability() {
  const { tasks } = useAppState();
  const u = useUsability();
  const [submitting, setSubmitting] = useState(false);
  const locked = submitting || Boolean(u.cloudSubmittedAt);
  const completed = MISSIONS.filter((m) => tasks[m.key]).length;
  const accessibilityDone = A11Y_SCENARIOS.filter((s) => u.scenarios[s.id]?.done).length;
  const surveyAnswered = POST_SURVEY_QUESTIONS.filter((q) => q.id === "overall" ? !!u.post.overall : !!u.post.ratings?.[q.id]).length;

  const exportSession = () => {
    if (!u.consent) return;
    try {
      const rows = exportRows(u, MISSIONS.map((m) => ({ key: m.key, title: m.title, done: tasks[m.key] })));
      const blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "yard-studio-usability-session.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify.info("Usability results exported from this browser.");
    } catch {
      notify.error("Could not export the results. Please try again.");
    }
  };

  const submitToCloud = async () => {
    if (submitting || !u.consent || u.cloudSubmittedAt) return;
    setSubmitting(true);
    try {
      const id = usability.beginCloudSubmission(crypto.randomUUID());
      await submitUsabilityToCloud(id, u, MISSIONS.map((m) => ({ key: m.key, done: Boolean(tasks[m.key]) })));
      usability.markCloudSubmitted(id);
      notify.success("Survey submitted and stored securely.");
    } catch (error) {
      notify.error("Cloud submission failed. Your local answers are still saved; retry when connected.");
      console.error("Survey submission was not confirmed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl min-w-0">
      <PageHeader eyebrow="Experience lab · usability study" title="Usability Test"
        actions={<DemoBadge>{completed} of 4 missions · {accessibilityDone} of 6 accessibility tasks</DemoBadge>}>
        Practice core student workflows and gather optional accessibility feedback. Completing a task is not the same as proving it was easy or WCAG compliant.
      </PageHeader>

      <section className="mb-8 rounded-md border-2 border-ink bg-cream p-5" aria-labelledby="instructions">
        <h2 id="instructions" className="font-display text-3xl text-navy">Before testing</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-6 text-sm leading-relaxed">
          <li>Ask the participant to think aloud without coaching them toward the answer.</li>
          <li>Have them attempt each mission. Observe independent completion and where help is needed.</li>
          <li>Test accessibility tasks with the appropriate keyboard, browser zoom or assistive technology.</li>
          <li>Ask about difficulty, record barriers, and submit or export responses only with participant agreement.</li>
        </ol>
        <p className="mt-3 text-sm">No background recording or tracking analytics is performed. Notes stay on this device as a draft. Selecting Submit survey securely sends ratings, task outcomes, notes and the optional anonymous code to a private study database, with a submission timestamp. Do not enter names or sensitive information.</p>
        <label className="mt-4 flex items-start gap-3 rounded-md border bg-card p-3 text-sm font-medium">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--navy)]" checked={u.consent} disabled={locked}
            onChange={(e) => usability.setConsent(e.target.checked)} />
          The participant agrees to local draft collection and optional cloud submission of survey answers for this usability study.
        </label>
        {u.consent && (
          <div className="mt-4">
            <label htmlFor="participant-code" className="block text-sm font-semibold">Anonymous session code (optional)</label>
            <input id="participant-code" maxLength={40} value={u.participantCode} disabled={locked} onChange={(e) => usability.setParticipant(e.target.value)}
              placeholder="Example: Test-01" className="mt-1 min-h-11 w-full max-w-sm rounded-md border bg-card px-3" />
          </div>
        )}
        {!u.consent && <p className="mt-2 text-xs text-muted-foreground">Task links and the four completion indicators still work. Optional answers and submission are available after consent.</p>}
        {usabilityStorageError && <p role="alert" className="mt-3 font-semibold text-cardinal">Browser storage is blocked; notes may be lost on refresh.</p>}
      </section>

      <section aria-labelledby="functional-missions" className="mb-10">
        <div className="mb-5 rounded-md border-2 border-ink bg-navy p-6 text-paper">
          <h2 id="functional-missions" className="font-display text-3xl">Core workflow missions</h2>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <p className="font-display text-4xl">{completed} / 4 missions</p>
            <p className="text-sm text-paper/80">{completed === 4 ? "All four actions recorded" : "Complete the actions in the app"}</p>
          </div>
          <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-paper/20" role="progressbar"
            aria-valuemin={0} aria-valuemax={4} aria-valuenow={completed} aria-label="Core usability missions completed">
            <div className="h-full bg-gold" style={{ width: completed * 25 + "%" }} />
          </div>
          <p className="mt-3 text-xs text-paper/80">Actions are tracked locally; this indicator measures neither independence nor ease.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {MISSIONS.map((m) => {
            const notes = u.missionNotes[m.key] ?? { ease: "" as Ease, notes: "" };
            return (
              <article key={m.key} className="min-w-0 rounded-md border-2 border-ink bg-card p-5 shadow-block">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-4xl text-cardinal">{m.number}</span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    {tasks[m.key] ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <Circle className="h-5 w-5" aria-hidden />}
                    {tasks[m.key] ? "Action completed" : "Not completed"}
                  </span>
                </div>
                <h3 className="font-display mt-3 text-2xl leading-tight text-navy">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{m.description}</p>
                <Button asChild variant={tasks[m.key] ? "outline" : "cardinal"} className="mt-4 max-w-full whitespace-normal">
                  <Link to={m.destination}>{tasks[m.key] ? "Review this step" : m.cta} <ArrowRight aria-hidden /></Link>
                </Button>
                {u.consent && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <EaseInput id={"mission-ease-" + m.key} value={notes.ease} disabled={locked}
                      onChange={(ease) => usability.patchMission(m.key, { ease })} />
                    <div>
                      <label htmlFor={"mission-note-" + m.key} className="block text-xs font-semibold">Observations and barriers (optional)</label>
                      <textarea id={"mission-note-" + m.key} value={notes.notes} maxLength={1000} rows={2} disabled={locked}
                        onChange={(e) => usability.patchMission(m.key, { notes: e.target.value })}
                        className="mt-1 w-full rounded-md border bg-background p-3 text-sm"
                        placeholder="Where did the participant need assistance?" />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="a11y-scenarios" className="mb-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow text-cardinal">Inclusive design</p>
            <h2 id="a11y-scenarios" className="font-display mt-2 text-3xl text-navy">Accessibility scenarios</h2>
          </div>
          <DemoBadge>{accessibilityDone} of 6 recorded</DemoBadge>
        </div>
        <p className="mb-5 max-w-3xl text-sm">These scenarios test use with speech, low-vision options, keyboard interaction, screen readers, and nonvisual map alternatives. Some actions are tracked automatically; tasks needing external assistive technology require participant self-report.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {A11Y_SCENARIOS.map((s, i) => <ScenarioCard key={s.id} scenario={s} number={i + 1} consent={u.consent} locked={locked} />)}
        </div>
      </section>

      <section className="mb-8 min-w-0 overflow-hidden rounded-lg border-2 border-ink bg-card shadow-block" aria-labelledby="reflection">
        <div className="bg-navy px-4 py-6 text-paper sm:px-7 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow text-paper/75">Experience lab / Your feedback</p>
            <span className="rounded-full border border-paper/40 px-3 py-1 text-xs font-bold">1–5 rating survey</span>
          </div>
          <h2 id="reflection" className="font-display mt-4 text-3xl leading-tight sm:text-4xl">Post-test survey</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/90 sm:text-base">
            Tell us about your experience using The Yard Studio. Select the rating that best matches each statement.
            There are no right or wrong answers, and every question is optional.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
            <span aria-live="polite">{surveyAnswered} of {POST_SURVEY_QUESTIONS.length} answered</span>
            <span>{Math.round((surveyAnswered / POST_SURVEY_QUESTIONS.length) * 100)}% complete</span>
          </div>
          <div role="progressbar" aria-label="Post-test survey completion" aria-valuemin={0}
            aria-valuemax={POST_SURVEY_QUESTIONS.length} aria-valuenow={surveyAnswered}
            className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-paper/25">
            <div className="h-full rounded-full bg-gold transition-[width]" style={{ width: (surveyAnswered / POST_SURVEY_QUESTIONS.length) * 100 + "%" }} />
          </div>
        </div>
        <div className="min-w-0 bg-cream px-3 py-5 sm:px-6 sm:py-7">
          <div className="mb-4 rounded-md border-l-4 border-cardinal bg-card px-3 py-3 text-sm sm:px-4">
            <p className="font-semibold text-navy">How to rate each statement</p>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              <strong className="text-ink">1</strong> = Strongly disagree
              <span aria-hidden="true" className="mx-2">·</span>
              <strong className="text-ink">3</strong> = Neutral
              <span aria-hidden="true" className="mx-2">·</span>
              <strong className="text-ink">5</strong> = Strongly agree
            </p>
          </div>
          {!u.consent && (
            <p role="status" className="mb-4 rounded-md border border-cardinal/40 bg-card p-3 text-sm font-semibold text-cardinal">
              To answer, agree to voluntary survey collection in the Before testing section above.
            </p>
          )}
          <div className="grid min-w-0 gap-3 sm:gap-4">
            {POST_SURVEY_QUESTIONS.map((q, i) => (
              <SurveyQuestion key={q.id} id={q.id} question={q.text} number={i + 1}
                disabled={!u.consent || locked}
                value={q.id === "overall" ? u.post.overall : (u.post.ratings?.[q.id] ?? "")}
                onChange={(rating) => usability.patchPostRating(q.id, rating)} />
            ))}
          </div>
        </div>
        <div className="border-t border-ink/15 bg-card px-4 py-6 sm:px-7">
          <h3 className="font-display text-2xl text-navy">Anything else we should know?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            These two responses are optional. Please avoid entering names or private information.
          </p>
          <div className="mt-4 grid gap-4">
            <div>
              <label htmlFor="liked" className="block text-sm font-semibold">What worked especially well?</label>
              <textarea id="liked" disabled={!u.consent || locked} value={u.post.liked} maxLength={1500} rows={3}
                onChange={(e) => usability.patchPost({ liked: e.target.value })}
                placeholder="For example, a tool that was easy to find or use…"
                className="mt-2 w-full rounded-md border bg-background p-3 text-sm disabled:opacity-60" />
            </div>
            <div>
              <label htmlFor="confusing" className="block text-sm font-semibold">What would you improve?</label>
              <textarea id="confusing" disabled={!u.consent || locked} value={u.post.confusing} maxLength={1500} rows={3}
                onChange={(e) => usability.patchPost({ confusing: e.target.value })}
                placeholder="For example, something unclear, slow, or hard to navigate…"
                className="mt-2 w-full rounded-md border bg-background p-3 text-sm disabled:opacity-60" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Drafts save in this browser. Nothing is sent to the research database until you select Submit survey securely.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={exportSession} disabled={!u.consent} variant="outline">
                <Download aria-hidden /> Export this session CSV
              </Button>
              <Button onClick={submitToCloud} disabled={!u.consent || locked} variant="cardinal">
                <ShieldCheck aria-hidden /> {u.cloudSubmittedAt ? "Submitted" : submitting ? "Submitting..." : "Submit survey securely"}
              </Button>
            </div>
          </div>
          {u.cloudSubmittedAt && (
            <p role="status" className="mt-4 rounded-md border border-navy/25 bg-cream p-4 text-sm font-semibold text-navy">
              <CheckCircle2 className="mr-2 inline h-5 w-5" aria-hidden /> Your answers have been stored in the private study database. Thank you! The submitted session is now read-only. Reset to start a new participant. To request removal of this submission, give the study facilitator your receipt ID: <span className="break-all font-mono">{u.cloudSubmissionId}</span>.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-md border p-5" aria-labelledby="restart">
        <h2 id="restart" className="font-display text-3xl text-navy">Start another test session</h2>
        <p className="mt-2 text-sm">Clears the four mission checkmarks and all local testing notes. Projects, studio invitations, reviews, and accessibility preferences are preserved. Export results first if you need them. Previously submitted cloud responses remain stored in the study database.</p>
        <Button className="mt-4" variant="outline" onClick={() => {
          actions.resetTasks();
          usability.reset();
          if (usabilityStorageError) {
            notify.error("Testing notes could not be saved to this browser. The reset may not persist after refresh.");
          } else {
            notify.success("Test progress and notes reset; projects and accessibility settings preserved.");
          }
        }}><RotateCcw aria-hidden /> Reset testing session</Button>
      </section>
      <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden />
        <span>This application is an independent HCI demonstration, not an official Howard service. Accessibility test completion does not certify WCAG compliance.</span>
      </p>
    </div>
  );
}
