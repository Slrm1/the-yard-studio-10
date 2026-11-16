# Yard Studio Accessibility & Usability Audit

**Last updated:** 2026-11-16  
**Scope:** \`Slrm1/the-yard-studio-10\`, TanStack Start web app, private GitHub repository connected to Lovable.  
**Target:** WCAG 2.2 Level AA; this document is a preliminary code-oriented traceability register, **not a claim of WCAG compliance or certification**.

## Evidence and limitations

The repository includes a newly implemented Accessibility Settings route, visual and ARIA feedback, a speechSynthesis helper, a six-scenario usability-testing model, and an expanded Usability Test page. Code has been reviewed, but **build, lint, typecheck, automated test execution, authenticated in-app browser evaluation, browser zoom/reflow, high-contrast rendering, and testing with NVDA, VoiceOver, or TalkBack are not confirmed**. Therefore the product is **NOT YET VERIFIED FOR FORMAL USER TESTING**. The existing preview URL may still serve an older or broken build until deployment verification.

Do not replace test evidence with visual assurances or an axe score: automated audits cannot establish complete accessibility.

## Traceability and manual verification matrix

| Requirement | Relevant WCAG 2.2 criteria / UX principle | Code path | Evidence status | Required manual check |
|---|---|---|---|---|
| Accessible labels and names for every actionable control | 1.3.1, 2.4.6, 4.1.2 | \`src/components/app-shell.tsx\`, \`src/routes/settings.tsx\`, all routes | Partial implementation; unverified | VoiceOver/NVDA announce names, role and state |
| Fully keyboard-operable workflows without traps | 2.1.1, 2.1.2, 2.4.3 | Navigation, dialogs, editor, reviews, map directory | Unverified | Tab, Shift+Tab, Space, Enter, Escape; no mouse |
| Visible focus and focus not obscured | 2.4.7, 2.4.11 | \`src/styles.css\`, \`src/components/announcer.tsx\` | Partial implementation; unverified | Focus each control with sticky mobile header active |
| Consistent navigation and predictable actions | 3.2.3, 3.2.4 | \`src/components/app-shell.tsx\` | Partial implementation; unverified | Cross-page navigation on mobile and desktop |
| Text contrast and nontext contrast | 1.4.3, 1.4.11 | \`src/styles.css\` | Unverified | Measure both default and high-contrast themes with contrast tools |
| Text resizing, spacing and responsive reflow | 1.4.4, 1.4.10, 1.4.12 | \`src/styles.css\`, settings | Partial implementation; unverified | 200%/400% zoom, 320 CSS px, long text, forms and dialogs |
| Touch target size | 2.5.8 (AA); 44px design recommendation | \`src/styles.css\` | Partial implementation; unverified | Measure all clickable targets and spacing |
| Respect reduced motion | 2.3.3 (AAA advisory), device preference | \`src/styles.css\`, settings | Partial implementation; unverified | OS and in-app reduced-motion setting |
| Important status messages announced without focus theft | 4.1.3 | \`src/lib/announce.ts\`, \`src/components/announcer.tsx\` | Partial implementation; unverified | Spoken confirmation off and on; screen readers |
| Optional speech doesn't interrupt a screen reader | User preference; inclusive design | \`src/lib/speech.ts\`, \`src/routes/settings.tsx\` | Partial implementation; unverified | NVDA/VoiceOver speech timing and duplication |
| Errors identify what failed and how to fix it | 3.3.1, 3.3.3 | Dialogs, forms, \`src/lib/announce.ts\` | Partial implementation; unverified | Missing fields, blocked storage, unsupported speech |
| Map has text equivalent, independent of markers | 1.1.1, 2.1.1, 1.3.1 | \`src/components/campus-ui.tsx\`, \`src/routes/map.tsx\` | Partial implementation; unverified | Find Founders Library entirely via list |
| No false real-emergency functionality | Safety and trust | \`src/routes/emergency.tsx\`, \`src/routes/robots.tsx\` | Disclaimer present; unverified | Check all drills and messages |
| Research consent and no invented user-study results | Ethical usability research | \`src/lib/usability.ts\`, \`src/routes/usability.tsx\` | Partial implementation; unverified | Consent on/off, clear notes, export, reset |
| Automated regression checks | Software quality | \`src/test/accessibility-usability.test.ts\` | Written but not executed | Run Vitest, TypeScript, lint, build |

## User-facing functionality to inspect

- Desktop and mobile access to **Accessibility Settings**
- Spoken action and page navigation confirmations are **off by default**
- Test Voice / Stop Speaking, voice/rate/volume controls and browser support fallback
- Default, large and extra-large text; high contrast; larger targets; enhanced focus; reduced motion; text spacing
- A separate preferences storage key that does not wipe original project data
- Two screen-reader live regions (polite status, assertive errors)
- Original four mission progress indicators remain action-based
- Six additional accessibility scenarios are clearly separated as observed actions or participant self-reports
- Optional test participant consent, anonymous code, task notes/ease ratings, reflection, and manual CSV export
- All emergency and robot functions clearly represented as **simulations only**

## Browser QA attempt — 2026-11-16

A live browser visit to the existing Lovable preview at `https://id-preview--72abc57c-d854-4fa2-b41e-0b619d3fc9de.lovable.app` tested the root, `/settings`, and `/usability`. Each redirected to `https://lovable.dev/login` for an unauthenticated visitor. This is an **access-control/preview-access limitation**, not evidence that the app's routes or controls failed after authentication. No settings toggles, persistence, speech playback, usability tasks, responsive layout, or accessible controls could be exercised in this attempt. Retest with an authorized session or an approved public staging release; do not use this result to claim feature functionality or WCAG conformance.

The connected Lovable build agent reported an `out_of_credits` completion reason after saving initial changes. GitHub subsequently showed the additional usability page, automated-test source files, and research documents, but no successful full build/test run is established for this revision. The GitHub verification workflow is manual-only while Actions billing/spending limits are unresolved. Do not infer success from the existence of test files.

## Release and research gates

**Required before formal participant study:**
1. Execute \`bun install --frozen-lockfile\`, \`bun run build\`, \`bun run test\`, \`bun run lint\`, plus \`bunx tsc --noEmit\` or the appropriate project typecheck. Fix failures.
2. Open the Lovable preview and test every settings control, action confirmation, and functional mission.
3. Run an automated WCAG scan (axe, Lighthouse or equivalent) on representative routes, resolve serious issues, and document rule results.
4. Manually inspect with keyboard alone, at 200–400% zoom, and on iOS/Android widths.
5. Test with real NVDA and VoiceOver users; TalkBack if available. Record browser, OS, screen reader version, date, and observed outcome.
6. Confirm speech-off cancels an ongoing utterance, no double-read status in screen readers, and no false success after blocked localStorage.
7. Confirm the consent checkbox and reset/export flows behave as described, including participant-code data minimization.
8. Obtain real participant consent before recording task notes. Do not claim a metric until actually measured.

**Current disposition:** Implementation partially complete; testing and certification pending. Do not label it "WCAG AA compliant" or "ready for formal accessibility studies" without completing these gates.

## Sources and research baseline

- [W3C Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C WAI — Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/)
- [W3C WAI — Cognitive Accessibility](https://www.w3.org/WAI/cognitive/)
- [W3C WAI — ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Nielsen Norman Group — Usability Testing](https://www.nngroup.com/articles/usability-testing-101/)
