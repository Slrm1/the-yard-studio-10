# Yard Studio Usability Testing Protocol

**Version:** 2026-11-16. Independent student HCI research demonstration, not an official Howard service.

## Goal

Evaluate whether novice students and participants with different accessibility needs can find, understand, and complete the campus design workspace's main activities. Identify **where the design needs improvement**, not whether participants are skilled.

## Before recruiting

Only run formal sessions after documenting a working build, smoke-test evidence, and a keyboard/screen-reader baseline. Small qualitative rounds of approximately five participants can reveal problems quickly, but do not substitute for including users with distinct accessibility needs. Include low-vision, screen-reader, keyboard-only, motor, and cognitive-access needs as relevant; do not infer disabilities or require disclosure.

Do not collect passwords, university ID, medical details, or private account information. The app records no backend analytics; local notes remain on that browser. Use anonymous codes, not participant names.

## Facilitator introduction

> Thanks for helping us test Yard Studio, a student-made campus design workspace. We are evaluating the website, not you. Some features and emergency/robot experiences are simulated; no real invitations or safety messages are sent. You can stop or skip any task. If you agree, we will note where you find things easy or difficult and optionally save anonymous observations locally. We won't record your screen or voice in the app. May we begin?

Obtain explicit agreement before enabling the recording of notes on the Usability Test page. For research involving minors, seek appropriate institutional permission. Do not pressure participation.

## Moderated test tasks

Read each prompt **without revealing where to click**. Allow participants to use their customary assistive technology and normal device settings. Record whether the task was independently completed, completed with facilitator assistance, abandoned, or not applicable. Record reason and observed barriers without assigning blame.

| Task | Neutral user-facing prompt | Evidence |
|---|---|---|
| 1 | "Create a Spring Fest event-page concept." | Spring Fest project creation appears in local mission progress |
| 2 | "Invite a teammate to a design studio." | Simulated invitation recorded; participant understands no email was sent |
| 3 | "Find the HUSA Voting mobile header review." | Review opened |
| 4 | "Give the design team feedback on its readability." | Comment saved locally |
| 5 | "Find where to turn on spoken confirmations." | Setting enabled; optional Test Voice run |
| 6 | "Save a version and tell us what confirmation you received." | Visible result, optional speech; participant self-report |
| 7 | "Make text easier for you to read, then look at another page." | Text/spacing preference set and readable |
| 8 | "Use only the keyboard to open a review and leave feedback." | No pointer needed; participant report + facilitator observation |
| 9 | "Use your screen reader to create a project." | Screen reader's announcements and participant report |
| 10 | "Find Founders Library without interacting with the map." | Building directory selection |

Do not count simply arriving at a page as proof a task was understood. Automated "complete" signals only establish a particular app action. The facilitator must separately observe independence, difficulty, and accessibility issues. Confirm browser-storage persistence with a refresh.

## Post-test rating survey

At the end of the session, let the participant answer seven short statements without coaching or suggesting preferred responses. Each statement has one selectable rating; all statements are worded positively, so a higher number always indicates a more favorable experience.

**Agreement scale:** 1 = Strongly disagree (lowest), 2 = Disagree, 3 = Neither agree nor disagree, 4 = Agree, 5 = Strongly agree (strongest).

1. Overall, Yard Studio was easy to use.
2. It was easy to find the pages and tools I needed.
3. The labels and instructions were clear.
4. The text and controls were easy to see and read.
5. I could tell when my actions were successful.
6. I was able to complete the tasks without help.
7. I would feel confident using Yard Studio on my own.

Questions may be skipped, and a selected rating can be cleared. Two free-text questions are optional: what worked well, and what the participant would improve or change. Consent is required before ratings are stored locally. Answers persist in that browser's test session and are included in the manual CSV export as separate `posttest` rows. The overall question reuses the previous overall rating field to preserve older sessions.

**Do not mix scales during analysis:** each individual mission/scenario asks about *task ease* (1 = Very difficult, 5 = Very easy), while these post-test statements use *agreement* (1 = Strongly disagree, 5 = Strongly agree). Neither kind of self-report is equivalent to an objective completion or accessibility measurement.

## Discussion questions

- What did you expect to happen after clicking that button?
- How did you know your action succeeded?
- Was anything hard to read, hear, reach, or understand?
- What would you change about navigation?
- Which task took the most effort and why?
- Did any interface announcement repeat, interrupt, or fail to happen?
- Did the map directory let you access the same information without map interaction?
- What would make you comfortable using this on your own?

Treat both the task-ease ratings and post-test agreement scores as **subjective ratings**, not objective usability measurements or measured accuracy scores.

## Recording template

For each participant, capture an anonymous session code; browser/device/assistive technology only if participant chooses to share; task ID; independent outcome; whether help was needed; key errors; accessibility barrier; severity; ease rating; verbatim feedback if consented. Time tasks only if a real timer is used and the participant is informed, never fill invented durations.

Export the local CSV through the Usability Test page after consent. Store externally only under your approved research retention practices. Remove identifiers. Revoke consent by clearing the local session notes.

## Interpreting and fixing findings

Cluster issues by task and root cause. Prioritize blockers to task completion, keyboard traps, screen-reader confusion, inaccessible controls, and false feedback. Log each reproducible defect with: route, steps, environment, expected outcome, actual outcome, severity, suggested fix, retest evidence. Repeat focused tests after repairs. A successful demonstration is not proof of universal usability.

## Mandatory manual test matrix

- Desktop keyboard only (Tab, Shift+Tab, Enter, Space, Escape)
- NVDA + Chrome or Firefox on Windows
- VoiceOver + Safari on iPhone or macOS
- TalkBack + Chrome on Android if available
- 320 CSS px layout and 200–400% zoom/reflow
- Device high contrast and reduced motion
- Speech supported/unsupported and speech toggled off mid-utterance
- LocalStorage disabled or quota exceeded
- Real and simulated actions; clear disclaimer on emergency and robot UI

Record actual outcome, date, tester, browser versions, and defects. If a combination could not be tested, mark **not tested** rather than passing it.

## Reference materials

[WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI Evaluation Guide](https://www.w3.org/WAI/test-evaluate/), [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/), and [NN/g Usability Testing 101](https://www.nngroup.com/articles/usability-testing-101/).
