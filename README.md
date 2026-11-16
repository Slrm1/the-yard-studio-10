# The Yard Studio (10)

Build a polished, FUNCTIONAL Lovable web app called "The Yard Studio — Bison Built. Yard Born." for a student HCI project at Howard University. THIS IS NOT A CREATIVE AGENCY. It is a collaborative UI design workspace (think Figma/Whimsical for campus teams), PLUS a separate robot-assisted emergency preparedness demo.

The user ALREADY HAS a functional single-file reference MVP with this same concept, whose design to recreate is: gorgeous editorial Howard-inspired, deep Bison blue #003352 + cardinal red #E51937 + paper cream/white, commanding oversized uppercase typography with a hero "BISON BUILT. YARD BORN.", energetic campus project showcase tiles, premium art-directed visuals, collegiate photography/illustration, compact well-structured product side navigation. Not bland generic admin cards, not AI slop. Mobile-first with desktop polish. Independent student project — do not claim official Howard endorsement. Bold accents balanced with generous whitespace. Use images only if appropriate and robust.

EXACT PRODUCT NAV / SCREENS:
1) THE YARD: discover/feed home with dramatic brand hero, search, trending campus design projects, request for collaborators, "Create project", recent activity. Sample CONCEPT projects: HUSA Voting Page, Spring Fest/ Homecoming event site, The Hilltop digital redesign, Campus Robotics Emergency App; all marked "Demo / concept".
2) ORG STUDIOS: create an org space, see members and projects, click a project to edit; simulate inviting teammates, visibly explain demo status.
3) DESIGN EDITOR: interactive canvas with desktop/mobile preview toggle and real editable properties (title, subtitle, CTA text, colors, schedule items). Save edits locally in localStorage, autosave and version history with timestamps. Change preview immediately. "Submit for review" creates a review request, Reviewer role can approve, Studio Lead role can merge; show state transitions and simulated branch history. IMPORTANT no fake cross-user collaboration.
4) FOUNDERS LIBRARY: Howard-inspired design tokens and at least 6 click-to-preview reusable components; clicking "Use component" adds it to selected project's canvas or creates a new project first.
5) BLACKBURN LOUNGE: discussion threads with posts/comments via localStorage. Simulated sample content labeled as such.
6) SEASONAL SPACES: Homecoming and Spring Fest temporary design rooms with projects.
7) REVIEW QUEUE: HUSA voting mobile header design changes needing critique, comments, approve/request changes with role-based demo switch, and statuses; provide obvious "Review HUSA header" CTA.
8) MY BISON CARD: sample profile, portfolio contribution badges, role switch for demo: New Bison / Contributor / Reviewer / Studio Lead / Advisor. Do not label simulated badges as earned.
9) USABILITY TEST: prominent guided tasks matching the source class assignment: (A) create Spring Fest event page and invite one teammate; (B) open HUSA Voting Page mobile header change and leave feedback; display step completion feedback, no fabricated times.
10) EMERGENCY MODE: an ALWAYS ACCESSIBLE nav entry with high-contrast distinctive styling, but NOT a live alert. Header says "PREPAREDNESS DEMO — No live incidents or alerts." Show quick links to 911 (tel:911), Howard Public Safety emergency line (202) 806-7777 (tel:), and official safety notification page https://publicsafety.howard.edu/emergency-management/emergency-notifications (links should be safe and valid). Guidance selector for fire, severe weather, threat, medical, shelter-in-place, accessibility support, phrased as GENERAL PREPAREDNESS ONLY; prioritize official alerts and responder instructions. Local-only "I'm safe / Need assistance" UI explicitly never sends messages.
11) INTERACTIVE HOWARD-AREA MAP: Leaflet + OpenStreetMap street map centered ~38.9216,-77.0203 with pan, zoom and filter categories for campus landmarks, transit, safety contacts, and ROBOTS DEMO. Mark reference POIs for Founders Library, Blackburn Center, The Yard, Howard University Hospital, Shaw–Howard U Metro, and 3 robot demo positions that are visually unmistakably FICTIONAL. Do not use sample pins for real route navigation, do not mark a safe zone or compute unsafe 'safe' routes. If tile loading fails show an interactive schematic fallback. Optional opt-in browser geolocation only with explanation.
12) EVACUATION ROBOT SIMULATOR: three simulated "Bison Bot" clickable fleet cards with example statuses like "Ready — DEMO"; selection highlights fictional robot marker on map. User can choose General, Mobility support / no stairs, Visual / hearing assistance, Cannot evacuate. "Start robot guidance practice" launches a 4-step interactive walkthrough using realistic sample text, back/next/reset, voice read-aloud via browser speech synthesis when supported. HUGE non-ambiguous demo label: "No physical robots connected; cannot dispatch, locate hazards, or verify safe exit paths. In actual emergency do not wait for a robot." No fake real emergency warning banners. Option to start/end a DRILL clearly labeled as practice.

MVP FUNCTIONALITY BAR:
- Every button clickable, no dead links. All screens navigable; responsive navigation, mobile hamburger, search/filter, modal/dialog; working form validation.
- Persist projects/edits/comments/review statuses/role choice in localStorage so page refresh retains work; communicate demo limitations. Explicitly no true authentication, server database, multiuser sync, safety alerts or robot hardware. No fake server success.
- Preserve a beautiful, cohesive actual product workspace, not a marketing-only landing page; meaningful sample seed data and empty states.
- Accessibility: keyboard/focus, screen reader labels, contrast, reduced motion, mobile touch targets, avoid flashing urgent banners.
- Strong defensive code: React TS, Tailwind/shadcn and router in existing stack, modular components and typed model, error handling, no render loops or infinite effects, no uncontrolled external URL dependencies except optional map.
- Include README detailing demo and safety limitations. Run tsc/build/tests and fix issues. The final result MUST be viewable via Lovable preview.

DESIGN direction: editorial premium Howard aesthetic: large two-line off-kilter hero, offset red "Y" star mark, dark navy studio sidebar, card art with bold type and color blocks not generic pictogram grids; application controls are crisp, compact, purposeful. Treat existing pages as a coherent app with high usability. Ensure Emergency Mode is instantly accessible from every screen but separate from normal design work. No affiliation or real safety service implied.

Please implement now, not merely outline a plan. Prioritize working user journeys (create/edit/review a campus design project; emergency map and robot practice), then remaining screens and polish.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/72abc57c-d854-4fa2-b41e-0b619d3fc9de).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```


## Accessibility preferences and usability study

The application includes an **Accessibility Settings** route at \`/settings\`. Browser-local, opt-in spoken confirmations are off by default; screen-reader live-region updates do not depend on them. Display preferences include text size, high contrast, larger targets, focus styling, motion and spacing. Browser storage for accessibility preferences is separate from concept projects and reviews.

The **Usability Test** route at \`/usability\` contains the four existing task-action missions plus six separate accessibility scenarios (speech, text scaling, keyboard, assistive technology, and nonvisual map use). Optional participant consent, anonymous code, qualitative notes, ease ratings and CSV export are local-only; some scenarios require self-report and real facilitator observation. The test interface **does not prove accessibility compliance**.

See [Accessibility Audit and WCAG Traceability](docs/ACCESSIBILITY_USABILITY_AUDIT.md) and [Usability Study Protocol](docs/USABILITY_TEST_PROTOCOL.md).

To validate a checkout with dependencies available:

\`\`\`sh
bun install --frozen-lockfile
bunx tsc --noEmit
bun run build
bun run test
bun run lint
\`\`\`

The feature code and new tests have been committed, but these commands and manual device/screen-reader testing must still be executed and recorded before declaring formal test readiness. Lovable's private preview may require signing in to the linked account.
