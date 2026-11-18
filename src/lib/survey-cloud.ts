import { supabase } from "@/integrations/supabase/client";
import {
  A11Y_SCENARIOS,
  POST_SURVEY_QUESTIONS,
  type UsabilityState,
} from "@/lib/usability";

interface MissionCompletion {
  key: string;
  done: boolean;
}

/**
 * Only the public, write-only database RPC is available to participants.
 * Results are not fetched from the browser or exposed through this app.
 * The database enforces consent, payload size, and duplicate-submission IDs.
 */
export async function submitUsabilityToCloud(
  id: string,
  state: UsabilityState,
  missions: MissionCompletion[],
): Promise<void> {
  if (!state.consent || state.cloudSubmittedAt) {
    throw new Error("This session is not eligible for submission.");
  }

  const missionResults = Object.fromEntries(
    missions.map((m) => [
      m.key,
      {
        completed: m.done,
        ease: state.missionNotes[m.key]?.ease ?? "",
        notes: (state.missionNotes[m.key]?.notes ?? "").slice(0, 1000),
      },
    ]),
  );

  const scenarioResults = Object.fromEntries(
    A11Y_SCENARIOS.map((scenario) => [
      scenario.id,
      {
        verification: scenario.verification,
        completed: state.scenarios[scenario.id]?.done ?? false,
        ease: state.scenarios[scenario.id]?.ease ?? "",
        notes: (state.scenarios[scenario.id]?.notes ?? "").slice(0, 1000),
      },
    ]),
  );

  const surveyRatings = Object.fromEntries(
    POST_SURVEY_QUESTIONS.map((q) => [
      q.id,
      q.id === "overall" ? state.post.overall : (state.post.ratings?.[q.id] ?? ""),
    ]),
  );

  // The generated Supabase types are refreshed by Lovable when its schema changes.
  // This narrow runtime-safe signature avoids editing generated files in Git.
  const rpc = supabase as unknown as {
    rpc: (name: string, args: Record<string, unknown>) => Promise<{
      data: boolean | null;
      error: { message: string } | null;
    }>;
  };

  const { data, error } = await rpc.rpc("submit_yard_usability", {
    p_id: id,
    p_participant_code: state.participantCode.trim() || null,
    p_missions: missionResults,
    p_accessibility: scenarioResults,
    p_post_test: {
      ratings: surveyRatings,
      liked: state.post.liked.slice(0, 1500),
      confusing: state.post.confusing.slice(0, 1500),
    },
    p_consent: true,
  });

  if (error || data !== true) {
    throw new Error(error?.message || "The database did not confirm this submission.");
  }
}
