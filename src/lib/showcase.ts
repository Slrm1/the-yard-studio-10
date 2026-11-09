/** Fictional display content for the Yard Studio showcase.
 * These are not real students, student organizations, or scheduled Howard events.
 */
export type ShowcasePerson = {
  id: string;
  name: string;
  initials: string;
  role: string;
  focus: string;
  orgId: string;
  skills: string[];
  blurb: string;
};
export const SAMPLE_PEOPLE: ShowcasePerson[] = [
  { id: "amara", name: "Amara O.", initials: "AO", role: "Studio Lead", focus: "Product design", orgId: "husa", skills: ["Figma", "Research"], blurb: "Building student-first interfaces, from election pages to club tools." },
  { id: "jordan", name: "Jordan T.", initials: "JT", role: "Reviewer", focus: "Accessible UX", orgId: "husa", skills: ["WCAG", "Usability"], blurb: "Keeps prototypes usable on small screens and keyboard-friendly." },
  { id: "kofi", name: "Kofi B.", initials: "KB", role: "Frontend Builder", focus: "Web development", orgId: "husa", skills: ["React", "CSS"], blurb: "Turns student design ideas into clickable web experiences." },
  { id: "nia", name: "Nia W.", initials: "NW", role: "Design Lead", focus: "Editorial design", orgId: "hilltop", skills: ["Layout", "Typography"], blurb: "Experiments with bold headlines and mobile storytelling." },
  { id: "malik", name: "Malik R.", initials: "MR", role: "Visual Designer", focus: "Identity systems", orgId: "hilltop", skills: ["Branding", "Illustration"], blurb: "Creates graphic systems inspired by campus culture." },
  { id: "zuri", name: "Zuri M.", initials: "ZM", role: "Prototype Lead", focus: "Human–robot interaction", orgId: "robotics", skills: ["HCI", "Prototyping"], blurb: "Designs safer, more understandable practice interactions." },
  { id: "imani", name: "Imani D.", initials: "ID", role: "UX Researcher", focus: "User testing", orgId: "robotics", skills: ["Interviews", "Testing"], blurb: "Asks better questions before adding another feature." },
  { id: "avery", name: "Avery S.", initials: "AS", role: "Creative Coder", focus: "Motion and interaction", orgId: "hilltop", skills: ["Animation", "JavaScript"], blurb: "Makes transitions meaningful rather than distracting." },
];

export type ShowcaseEvent = {
  id: string;
  season: "homecoming" | "springfest";
  title: string;
  kind: string;
  day: string;
  time: string;
  place: string;
  summary: string;
  host: string;
};
export const SAMPLE_EVENTS: ShowcaseEvent[] = [
  { id: "hc-kickoff", season: "homecoming", title: "Homecoming Creative Kickoff", kind: "Design meetup", day: "Thursday (sample)", time: "4:00 PM", place: "Blackburn Center (concept venue)", summary: "Student designers pitch ideas for a Homecoming hub and form small teams.", host: "HUSA Digital (fictional)" },
  { id: "hc-posters", season: "homecoming", title: "Yardfest Poster Lab", kind: "Workshop", day: "Friday (sample)", time: "2:30 PM", place: "The Yard (concept venue)", summary: "Compare poster drafts, typography and event graphics in a friendly critique.", host: "Hilltop Design Desk (fictional)" },
  { id: "hc-showcase", season: "homecoming", title: "Bison Builders Showcase", kind: "Show & tell", day: "Saturday (sample)", time: "11:00 AM", place: "Cramton Auditorium (concept venue)", summary: "Three-minute demos of student-built interfaces and creative experiments.", host: "The Yard Studio (fictional)" },
  { id: "sf-designjam", season: "springfest", title: "Spring Fest Design Jam", kind: "Hack + design", day: "Wednesday (sample)", time: "5:00 PM", place: "Blackburn Center (concept venue)", summary: "Make a friendly festival guide, event card, or mobile experience.", host: "HUSA Digital (fictional)" },
  { id: "sf-playtest", season: "springfest", title: "Prototype Playtest Picnic", kind: "User testing", day: "Friday (sample)", time: "12:00 PM", place: "The Yard (concept venue)", summary: "Swap phones and test each other's designs with quick feedback prompts.", host: "The Yard Studio (fictional)" },
  { id: "sf-community", season: "springfest", title: "Campus Creators Market", kind: "Creator showcase", day: "Saturday (sample)", time: "1:30 PM", place: "Upper Quad (concept venue)", summary: "Explore example projects from student creators, illustrators and builders.", host: "Hilltop Design Desk (fictional)" },
];
