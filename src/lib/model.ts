// Typed data model + pure rules for The Yard Studio (demo, local-only).

export type Role = "new" | "contributor" | "reviewer" | "lead" | "advisor";
export const ROLES: { id: Role; label: string; blurb: string }[] = [
  { id: "new", label: "New Bison", blurb: "Can browse, comment and create drafts." },
  { id: "contributor", label: "Contributor", blurb: "Edits projects and submits for review." },
  { id: "reviewer", label: "Reviewer", blurb: "Can approve or request changes." },
  { id: "lead", label: "Studio Lead", blurb: "Can approve and merge approved work." },
  { id: "advisor", label: "Advisor", blurb: "Leaves guidance; cannot approve or merge." },
];
export const roleLabel = (r: Role) => ROLES.find((x) => x.id === r)?.label ?? r;

export type ScheduleItem = { id: string; time: string; label: string };
export type DesignProps = {
  title: string;
  subtitle: string;
  cta: string;
  primary: string;
  accent: string;
  background: string;
  schedule: ScheduleItem[];
};
export type Version = { id: string; at: number; label: string; props: DesignProps; blocks: string[] };
export type BranchEvent = { id: string; at: number; branch: string; event: string };
export type Season = "homecoming" | "springfest" | null;

export type Project = {
  id: string;
  name: string;
  orgId: string;
  season: Season;
  tags: string[];
  updatedAt: number;
  props: DesignProps;
  blocks: string[]; // library component ids appended to the canvas
  versions: Version[];
  branches: BranchEvent[];
  seekingCollaborators?: string;
};

export type ReviewStatus = "open" | "changes" | "approved" | "merged";
export type Comment = { id: string; author: string; role: Role; body: string; at: number; sample?: boolean };
export type Review = {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  status: ReviewStatus;
  comments: Comment[];
  history: { at: number; from: ReviewStatus | null; to: ReviewStatus; by: Role }[];
  sample?: boolean;
};
export type Member = { name: string; role: string; invited?: boolean; email?: string };
export type Org = { id: string; name: string; tagline: string; members: Member[] };
export type Thread = {
  id: string;
  title: string;
  body: string;
  author: string;
  at: number;
  sample?: boolean;
  comments: Comment[];
};
export type Activity = { id: string; at: number; text: string };
export type ChatMessage = { id: string; author: string; body: string; at: number; sample?: boolean };
export type ChatRoom = { id: string; name: string; topic: string; messages: ChatMessage[] };

export type TaskFlags = {
  springfestCreated: boolean;
  teammateInvited: boolean;
  husaOpened: boolean;
  feedbackLeft: boolean;
};

export type AppState = {
  version: 1;
  role: Role;
  projects: Project[];
  reviews: Review[];
  orgs: Org[];
  threads: Thread[];
  chats: ChatRoom[];
  savedEventIds: string[];
  activity: Activity[];
  tasks: TaskFlags;
  selectedProjectId: string | null;
  safetyStatus: "safe" | "assist" | null;
  drillActive: boolean;
};

/** Review state machine. Returns null when allowed, otherwise a human reason. */
export function reviewBlockReason(role: Role, from: ReviewStatus, to: ReviewStatus): string | null {
  if (to === "approved") {
    if (role !== "reviewer" && role !== "lead") return "Only a Reviewer or Studio Lead can approve.";
    if (from !== "open") return "Only open requests can be approved.";
    return null;
  }
  if (to === "changes") {
    if (role !== "reviewer" && role !== "lead") return "Only a Reviewer or Studio Lead can request changes.";
    if (from !== "open" && from !== "approved") return "This request is not awaiting review.";
    return null;
  }
  if (to === "merged") {
    if (role !== "lead") return "Only a Studio Lead can merge.";
    if (from !== "approved") return "Approve the request before merging.";
    return null;
  }
  if (to === "open") {
    if (from !== "changes") return "Only requests needing changes can be resubmitted.";
    return null;
  }
  return "Unknown transition.";
}

export const statusLabel: Record<ReviewStatus, string> = {
  open: "Awaiting review",
  changes: "Changes requested",
  approved: "Approved",
  merged: "Merged",
};

export function validateProjectName(name: string): string | null {
  const t = name.trim();
  if (t.length < 3) return "Name needs at least 3 characters.";
  if (t.length > 60) return "Keep the name under 60 characters.";
  return null;
}
export function validateEmail(email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
  return null;
}

export function uid(prefix = "id"): string {
  const r = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : String(Date.now());
  return `${prefix}_${r}`;
}

export function formatTime(at: number): string {
  return new Date(at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
