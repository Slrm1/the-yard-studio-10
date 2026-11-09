import { useSyncExternalStore } from "react";
import { makeSeed } from "./seed";
import {
  type AppState,
  type Comment,
  type DesignProps,
  type Project,
  type ReviewStatus,
  type Role,
  type Season,
  reviewBlockReason,
  uid,
} from "./model";

const KEY = "yard-studio-state-v1";

let seedCache: AppState | null = null;
const seed = () => (seedCache ??= makeSeed());

let state: AppState | null = null;
const listeners = new Set<() => void>();

function load(): AppState {
  if (state) return state;
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && parsed.version === 1 && Array.isArray(parsed.projects)) {
        // Keep existing browser data when new demo collections are introduced.
        state = {
          ...seed(),
          ...parsed,
          chats: Array.isArray(parsed.chats) ? parsed.chats : seed().chats,
          savedEventIds: Array.isArray(parsed.savedEventIds) ? parsed.savedEventIds : [],
        };
        return state;
      }
    }
  } catch {
    /* corrupted storage: fall back to seed */
  }
  state = seed();
  return state;
}

export let storageError: string | null = null;

function set(fn: (s: AppState) => AppState) {
  state = fn(load());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    storageError = null;
  } catch {
    storageError = "Could not save to this browser’s storage. Changes will be lost on refresh.";
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, load, seed);
}

const now = () => Date.now();
const log = (s: AppState, text: string): AppState => ({
  ...s,
  activity: [{ id: uid("a"), at: now(), text }, ...s.activity].slice(0, 30),
});
const patchProject = (s: AppState, id: string, fn: (p: Project) => Project): AppState => ({
  ...s,
  projects: s.projects.map((p) => (p.id === id ? fn(p) : p)),
});

export const actions = {
  setRole(role: Role) {
    set((s) => ({ ...s, role }));
  },
  selectProject(id: string | null) {
    set((s) => ({ ...s, selectedProjectId: id }));
  },
  createProject(input: { name: string; orgId: string; season: Season; template?: Partial<DesignProps> }): string {
    const id = uid("p");
    const at = now();
    const props: DesignProps = {
      title: input.name,
      subtitle: "A new campus concept. Edit me in the properties panel.",
      cta: "Get involved",
      primary: "#003352",
      accent: "#E51937",
      background: "#FBF8F1",
      schedule: [],
      ...input.template,
    };
    const p: Project = {
      id,
      name: input.name.trim(),
      orgId: input.orgId,
      season: input.season,
      tags: ["new"],
      updatedAt: at,
      props,
      blocks: [],
      versions: [{ id: uid("v"), at, label: "Created", props, blocks: [] }],
      branches: [{ id: uid("b"), at, branch: "main", event: "Project created" }],
    };
    set((s) => {
      const isSpring = input.season === "springfest" || /spring\s*fest/i.test(input.name);
      return log(
        {
          ...s,
          projects: [p, ...s.projects],
          selectedProjectId: id,
          tasks: isSpring ? { ...s.tasks, springfestCreated: true } : s.tasks,
        },
        `You created “${p.name}”`,
      );
    });
    return id;
  },
  deleteProject(id: string) {
    set((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id), reviews: s.reviews.filter((r) => r.projectId !== id) }));
  },
  updateProps(id: string, props: Partial<DesignProps>) {
    set((s) => patchProject(s, id, (p) => ({ ...p, props: { ...p.props, ...props }, updatedAt: now() })));
  },
  addBlock(id: string, block: string) {
    set((s) =>
      log(
        patchProject(s, id, (p) => ({ ...p, blocks: [...p.blocks, block], updatedAt: now() })),
        `You added a component to a project`,
      ),
    );
  },
  removeBlock(id: string, index: number) {
    set((s) => patchProject(s, id, (p) => ({ ...p, blocks: p.blocks.filter((_, i) => i !== index), updatedAt: now() })));
  },
  saveVersion(id: string, label: string) {
    set((s) =>
      patchProject(s, id, (p) => ({
        ...p,
        versions: [{ id: uid("v"), at: now(), label, props: p.props, blocks: p.blocks }, ...p.versions].slice(0, 40),
      })),
    );
  },
  restoreVersion(id: string, versionId: string) {
    set((s) =>
      patchProject(s, id, (p) => {
        const v = p.versions.find((x) => x.id === versionId);
        return v ? { ...p, props: v.props, blocks: v.blocks, updatedAt: now() } : p;
      }),
    );
  },
  submitForReview(projectId: string, summary: string): string {
    const id = uid("r");
    set((s) => {
      const p = s.projects.find((x) => x.id === projectId);
      const branch = `review/${id.slice(2, 8)}`;
      const s2 = patchProject(s, projectId, (pp) => ({
        ...pp,
        branches: [{ id: uid("b"), at: now(), branch, event: "Branch opened for review" }, ...pp.branches],
      }));
      return log(
        {
          ...s2,
          reviews: [
            {
              id,
              projectId,
              title: `${p?.name ?? "Project"} — design changes`,
              summary,
              status: "open",
              comments: [],
              history: [{ at: now(), from: null, to: "open", by: s.role }],
            },
            ...s2.reviews,
          ],
        },
        `You submitted “${p?.name}” for review`,
      );
    });
    return id;
  },
  /** Returns an error string if blocked by role/state rules. */
  transitionReview(reviewId: string, to: ReviewStatus): string | null {
    const s = load();
    const r = s.reviews.find((x) => x.id === reviewId);
    if (!r) return "Review not found.";
    const reason = reviewBlockReason(s.role, r.status, to);
    if (reason) return reason;
    set((st) => {
      let next: AppState = {
        ...st,
        reviews: st.reviews.map((x) =>
          x.id === reviewId ? { ...x, status: to, history: [...x.history, { at: now(), from: x.status, to, by: st.role }] } : x,
        ),
      };
      const event = to === "merged" ? "Merged into main" : to === "approved" ? "Approved" : to === "changes" ? "Changes requested" : "Resubmitted";
      next = patchProject(next, r.projectId, (p) => ({
        ...p,
        branches: [{ id: uid("b"), at: now(), branch: to === "merged" ? "main" : "review", event }, ...p.branches],
      }));
      return log(next, `Review “${r.title}”: ${event}`);
    });
    return null;
  },
  commentReview(reviewId: string, body: string) {
    set((s) => {
      const c: Comment = { id: uid("c"), author: "You", role: s.role, body: body.trim(), at: now() };
      const isHusa = reviewId === "husa-header";
      return log(
        {
          ...s,
          reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, comments: [...r.comments, c] } : r)),
          tasks: isHusa ? { ...s.tasks, feedbackLeft: true } : s.tasks,
        },
        "You left review feedback",
      );
    });
  },
  markHusaOpened() {
    if (load().tasks.husaOpened) return;
    set((s) => ({ ...s, tasks: { ...s.tasks, husaOpened: true } }));
  },
  createOrg(name: string, tagline: string): string {
    const id = uid("o");
    set((s) => log({ ...s, orgs: [...s.orgs, { id, name: name.trim(), tagline: tagline.trim(), members: [{ name: "You", role: "Studio Lead" }] }] }, `You created the org “${name.trim()}”`));
    return id;
  },
  inviteMember(orgId: string, email: string) {
    set((s) =>
      log(
        {
          ...s,
          orgs: s.orgs.map((o) => (o.id === orgId ? { ...o, members: [...o.members, { name: email.trim(), email: email.trim(), role: "Invited (simulated)", invited: true }] } : o)),
          tasks: { ...s.tasks, teammateInvited: true },
        },
        `Simulated invite recorded for ${email.trim()} (no email sent)`,
      ),
    );
  },
  addThread(title: string, body: string) {
    set((s) => ({ ...s, threads: [{ id: uid("t"), title: title.trim(), body: body.trim(), author: "You", at: now(), comments: [] }, ...s.threads] }));
  },
  commentThread(threadId: string, body: string) {
    set((s) => ({
      ...s,
      threads: s.threads.map((t) => (t.id === threadId ? { ...t, comments: [...t.comments, { id: uid("c"), author: "You", role: s.role, body: body.trim(), at: now() }] } : t)),
    }));
  },
  postChat(roomId: string, body: string) {
    const cleaned = body.trim();
    if (!cleaned) return;
    set((s) => ({
      ...s,
      chats: s.chats.map((room) => room.id === roomId
        ? { ...room, messages: [...room.messages, { id: uid("m"), author: "You", body: cleaned, at: now() }].slice(-50) }
        : room),
    }));
  },
  toggleEventInterest(eventId: string) {
    set((s) => ({
      ...s,
      savedEventIds: s.savedEventIds.includes(eventId)
        ? s.savedEventIds.filter((id) => id !== eventId)
        : [...s.savedEventIds, eventId],
    }));
  },
  setSafety(status: "safe" | "assist" | null) {
    set((s) => ({ ...s, safetyStatus: status }));
  },
  setDrill(active: boolean) {
    set((s) => ({ ...s, drillActive: active }));
  },
  resetTasks() {
    set((s) => ({ ...s, tasks: { springfestCreated: false, teammateInvited: false, husaOpened: false, feedbackLeft: false } }));
  },
  resetAll() {
    seedCache = null;
    set(() => seed());
  },
};
