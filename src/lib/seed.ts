import type { AppState, DesignProps, Project } from "./model";

// Fixed timestamps keep seed data deterministic across server and client.
const T = Date.UTC(2026, 9, 20, 15, 0, 0);
const h = (n: number) => T + n * 3600_000;

const base = (p: Partial<DesignProps>): DesignProps => ({
  title: "Untitled page",
  subtitle: "Add a subtitle",
  cta: "Learn more",
  primary: "#003352",
  accent: "#E51937",
  background: "#FBF8F1",
  schedule: [],
  ...p,
});

function project(p: Omit<Project, "versions" | "branches"> & { created: number }): Project {
  const { created, ...rest } = p;
  return {
    ...rest,
    versions: [{ id: `${p.id}_v1`, at: created, label: "Initial concept", props: p.props, blocks: p.blocks }],
    branches: [{ id: `${p.id}_b1`, at: created, branch: "main", event: "Project created" }],
  };
}

export function makeSeed(): AppState {
  return {
    version: 1,
    role: "contributor",
    selectedProjectId: null,
    safetyStatus: null,
    drillActive: false,
    tasks: { springfestCreated: false, teammateInvited: false, husaOpened: false, feedbackLeft: false },
    orgs: [
      {
        id: "husa",
        name: "HUSA Digital",
        tagline: "Student government interfaces — concept work",
        members: [
          { name: "Amara O.", role: "Studio Lead" },
          { name: "Jordan T.", role: "Reviewer" },
          { name: "Kofi B.", role: "Contributor" },
        ],
      },
      {
        id: "hilltop",
        name: "Hilltop Design Desk",
        tagline: "Editorial and news layout concepts",
        members: [
          { name: "Nia W.", role: "Studio Lead" },
          { name: "Malik R.", role: "Contributor" },
        ],
      },
      {
        id: "robotics",
        name: "Campus Robotics Collective",
        tagline: "Human–robot interaction research concepts",
        members: [
          { name: "Dr. Example (sample advisor)", role: "Advisor" },
          { name: "Zuri M.", role: "Studio Lead" },
        ],
      },
    ],
    projects: [
      project({
        id: "husa-voting",
        name: "HUSA Voting Page",
        orgId: "husa",
        season: null,
        tags: ["mobile", "civic"],
        updatedAt: h(30),
        created: h(0),
        seekingCollaborators: "Looking for 1 accessibility reviewer",
        props: base({
          title: "Your Vote. Your Yard.",
          subtitle: "HUSA elections concept — compare candidates and find your polling window.",
          cta: "View the ballot",
          schedule: [
            { id: "s1", time: "Mon 9 AM", label: "Candidate forum (sample)" },
            { id: "s2", time: "Wed 12 PM", label: "Voting window opens (sample)" },
          ],
        }),
        blocks: ["vote-card"],
      }),
      project({
        id: "homecoming",
        name: "Homecoming Event Site",
        orgId: "husa",
        season: "homecoming",
        tags: ["event", "desktop"],
        updatedAt: h(26),
        created: h(2),
        seekingCollaborators: "Needs an illustrator for the yardfest poster",
        props: base({
          title: "Homecoming on the Hilltop",
          subtitle: "Concept site for a week of reunions, step shows and the yardfest.",
          cta: "See the week",
          primary: "#E51937",
          accent: "#003352",
          schedule: [
            { id: "s1", time: "Thu 7 PM", label: "Step show (sample)" },
            { id: "s2", time: "Sat 1 PM", label: "Yardfest (sample)" },
          ],
        }),
        blocks: ["countdown"],
      }),
      project({
        id: "hilltop",
        name: "The Hilltop Digital Redesign",
        orgId: "hilltop",
        season: null,
        tags: ["editorial", "responsive"],
        updatedAt: h(20),
        created: h(4),
        props: base({
          title: "The Hilltop",
          subtitle: "Concept front page for a student newspaper redesign.",
          cta: "Read today",
          background: "#FFFFFF",
        }),
        blocks: ["news-card"],
      }),
      project({
        id: "robotics-app",
        name: "Campus Robotics Emergency App",
        orgId: "robotics",
        season: null,
        tags: ["safety-research", "mobile"],
        updatedAt: h(18),
        created: h(5),
        seekingCollaborators: "Seeking HCI students for accessibility critique",
        props: base({
          title: "Preparedness, Practiced.",
          subtitle: "Research concept for robot-assisted drills. Not a live safety tool.",
          cta: "Open practice mode",
          primary: "#14161A",
          accent: "#F2C230",
        }),
        blocks: [],
      }),
    ],
    reviews: [
      {
        id: "husa-header",
        projectId: "husa-voting",
        title: "HUSA Voting — mobile header change",
        summary:
          "Proposes a compact sticky header on mobile: larger tap target for “View the ballot”, cardinal accent bar, and the title shortened to two lines.",
        status: "open",
        sample: true,
        comments: [
          {
            id: "c1",
            author: "Jordan T. (sample)",
            role: "reviewer",
            body: "Sample comment: does the red bar keep enough contrast against the cream background?",
            at: h(31),
            sample: true,
          },
        ],
        history: [{ at: h(30), from: null, to: "open", by: "contributor" }],
      },
    ],
    threads: [
      {
        id: "t1",
        title: "Best practices for mobile voting UIs?",
        body: "Sample thread: collecting references for accessible ballot layouts on small screens.",
        author: "Kofi B. (sample)",
        at: h(10),
        sample: true,
        comments: [
          { id: "tc1", author: "Nia W. (sample)", role: "lead", body: "Sample reply: big tap targets and plain language first.", at: h(11), sample: true },
        ],
      },
      {
        id: "t2",
        title: "Spring Fest palette — too much red?",
        body: "Sample thread: trying to balance cardinal with cream so the page doesn’t feel like an alert.",
        author: "Malik R. (sample)",
        at: h(14),
        sample: true,
        comments: [],
      },
    ],
    activity: [
      { id: "a1", at: h(31), text: "Sample: Jordan T. commented on the HUSA mobile header" },
      { id: "a2", at: h(26), text: "Sample: Homecoming Event Site moved into the Homecoming room" },
      { id: "a3", at: h(20), text: "Sample: The Hilltop redesign added a news card" },
    ],
  };
}
