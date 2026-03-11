---
title: URL Color Extractor ("Steal")
status: shipped
shipped: 2026-03-11
created: 2026-03-11
estimate: 5h
tier: standard
---

# URL Color Extractor — "Steal"

## Context

Designers and developers often want to reverse-engineer a site's color system. Today this requires browser DevTools, manual color-picking, and mental conversion to OKLCH. Magiklch should let users extract colors from any site and view them as organized OKLCH palettes — like Shazam for colors.

**Architecture:** Bookmarklet-based. A bookmarklet runs in the target site's browser context, reads computed styles via `document.styleSheets` + `getComputedStyle()`, extracts unique colors, and opens Magiklch `/steal?colors=hex1,hex2,...` with the results. The `/steal` page receives colors via URL params, parses to OKLCH, clusters by hue, and displays them.

**Why bookmarklet over server proxy:** Works on ALL sites (SPAs, CSS-in-JS, Tailwind, auth-gated pages). Zero server infrastructure, zero CORS, zero SSRF. The app stays pure client-side.

**Feature name:** "Steal" (short, memorable, verb). Final name TBD by user.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `app/steal/page.tsx` | CREATE | New route page with metadata + Suspense shell |
| `components/steal/steal-shell.tsx` | CREATE | Client shell: two modes (onboarding vs results), "How it works" modal |
| `components/steal/extracted-palette.tsx` | CREATE | Display component for a single extracted palette (hue family) |
| `components/steal/how-it-works-modal.tsx` | CREATE | Modal with 4 Action Cards explaining the bookmarklet flow |
| `lib/color-clusterer.ts` | CREATE | Pure function: group OKLCH colors by hue proximity into palette families |
| `lib/bookmarklet.ts` | CREATE | Bookmarklet source: extract colors from DOM, open Magiklch URL |
| `components/layout/sidebar.tsx` | MODIFY | Add "Steal" to `mainNav` array |
| `lib/color-parser.ts` | AFFECTED | Reused as-is — parses extracted hex strings to OKLCH |
| `types/color.ts` | MODIFY | Add `ExtractedColor`, `ExtractedPalette` types |
| `lib/__tests__/color-clusterer.test.ts` | CREATE | Tests for hue-based clustering |

**Files:** 7 create | 2 modify | 1 affected
**Reuse:** `parseColor()` from color-parser.ts, `PageHeader` layout component, existing shade-card patterns, `modal` + `action-card` from Lyse Registry components, `useCopy()` hook
**Breaking changes:** None
**New dependencies:** None — bookmarklet is vanilla JS, everything else uses existing stack

## User Journey (MANDATORY)

### Primary Journey

ACTOR: Designer/developer analyzing a website's color system
GOAL: Extract all colors from any website and view them as organized OKLCH palettes
PRECONDITION: User has visited the /steal page at least once

1. User visits /steal page for the first time
   → Sees the bookmarklet button ("Steal colors") with a one-line instruction: "Drag to your bookmarks bar, then click it on any website."
   → Sees "How it works" button to open the explanatory modal

2. User clicks "How it works"
   → Modal opens with 4 Action Cards explaining the flow:
   → Step 1: Drag "Steal colors" to your bookmarks bar
   → Step 2: Visit any website you like
   → Step 3: Click the bookmark — colors are extracted
   → Step 4: Click any color to generate a full OKLCH palette

3. User drags the bookmarklet to their bookmarks bar (one-time setup)
   → Bookmarklet appears in their browser bookmarks bar

4. User visits a target site (e.g. linear.app) and clicks the bookmarklet
   → Bookmarklet JS executes in the page context:
   → Reads `document.styleSheets` and `getComputedStyle()` on key elements
   → Extracts unique color values, deduplicates
   → Opens `magiklch.vercel.app/steal?colors=3b82f6,0f172a,ef4444,...` in a new tab

5. Magiklch /steal page receives colors via URL params
   → Each hex parsed to OKLCH via `parseColor()`
   → Colors clustered by hue proximity into families (Blues, Reds, Neutrals, etc.)
   → Each family sorted by lightness

6. User sees extracted palettes displayed as color swatches
   → Each palette family shown as a row of swatches
   → Each swatch shows: color preview, hex value, OKLCH values
   → Total color count displayed in PageHeader subtitle

7. User clicks a color swatch
   → Color values copied to clipboard
   → Toast confirmation

8. User clicks "Generate palette" on a color
   → Navigates to generator (`/?h=X&c=Y&name=Z`) with that color as seed
   → Full 11-shade palette generated from that base

POSTCONDITION: User has a visual map of the site's color system in OKLCH, can copy any value or expand to full palette

### Error Journeys

E1. No colors in URL (first visit or direct navigation)
   Trigger: User lands on /steal without `?colors=` params
   1. User navigates to /steal directly
      → System shows onboarding state: bookmarklet button + one-line instruction + "How it works" CTA
      → No error — this is the expected first-visit experience
   Recovery: User installs bookmarklet, uses it on a site, returns with colors

E2. Bookmarklet blocked by CSP
   Trigger: Target site has strict Content Security Policy blocking inline JS
   1. User clicks bookmarklet on a site with strict CSP
      → Nothing happens (browser silently blocks execution)
      → User sees no feedback on the target site
   Recovery: User tries a different site. CSP blocking is rare on marketing/public sites, more common on logged-in dashboards.

E3. Very few or no useful colors extracted
   Trigger: Bookmarklet runs but finds very few stylesheets or computed colors
   1. Bookmarklet extracts 0-2 colors
      → /steal page opens with very few swatches or empty state
      → If 0 colors: show message "No colors were extracted. The site may use unusual styling techniques."
   Recovery: User tries a different site

### Edge Cases

EC1. Very few colors (<3): Show flat list instead of grouped palettes
EC2. Duplicate colors across stylesheets: Deduplicated by the bookmarklet before passing to URL
EC3. Transparent/alpha colors: Bookmarklet extracts the base color, ignores alpha channel
EC4. URL param length: Cap at ~50 colors (350 chars of hex) to stay within URL limits
EC5. Achromatic colors (grays, black, white): Grouped as "Neutrals" (chroma < 0.02)
EC6. User has colors in URL AND revisits: Results page shown, onboarding hidden

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING — all must pass to ship)

- [ ] AC-1: GIVEN user is on /steal page without `?colors=` params WHEN page loads THEN onboarding state shown with bookmarklet button, one-line instruction, and "How it works" CTA
- [ ] AC-2: GIVEN user clicks "How it works" WHEN modal opens THEN 4 Action Cards explain the bookmarklet flow step by step
- [ ] AC-3: GIVEN bookmarklet is dragged to bookmarks bar and clicked on a target site WHEN executed THEN it extracts unique colors and opens Magiklch /steal with colors in URL params
- [ ] AC-4: GIVEN /steal page receives `?colors=hex1,hex2,...` WHEN page loads THEN colors are parsed to OKLCH and clustered by hue family with achromatics as "Neutrals"
- [ ] AC-5: GIVEN an extracted color swatch WHEN user clicks it THEN OKLCH/hex values are copied to clipboard with toast confirmation
- [ ] AC-6: GIVEN an extracted color WHEN user clicks "Generate palette" THEN user navigates to generator page with that color as seed input
- [ ] AC-7: GIVEN the /steal page WHEN viewed THEN it follows existing layout patterns (PageHeader, sidebar nav, responsive)

### Error Criteria (BLOCKING — all must pass)

- [ ] AC-E1: GIVEN /steal page with 0 colors in URL WHEN page loads THEN onboarding state shown (not an error state)
- [ ] AC-E2: GIVEN bookmarklet extracts 0 colors from a site WHEN /steal opens with empty colors param THEN helpful empty state message shown

### Should Have (ship without, fix soon)

- [ ] AC-8: GIVEN a site with >50 unique colors WHEN displayed THEN palette families are collapsible/expandable

## Scope

- [ ] 1. Create bookmarklet JS (extract computed colors from DOM, open Magiklch URL) → AC-3
- [ ] 2. Create color clusterer pure function (OKLCH colors → hue families) → AC-4
- [ ] 3. Create /steal page + shell component with two modes (onboarding vs results) → AC-1, AC-4, AC-7, AC-E1
- [ ] 4. Create "How it works" modal with 4 Action Cards → AC-2
- [ ] 5. Create extracted palette display components (hue family rows + swatches) → AC-4, AC-5
- [ ] 6. Wire "Generate palette" action to generator page → AC-6
- [ ] 7. Add empty state for 0 extracted colors → AC-E2
- [ ] 8. Add "Steal" to sidebar navigation → AC-7
- [ ] 9. Write unit tests for color clusterer → AC-4

### Out of Scope

- Server-side URL fetching / API route (bookmarklet replaces this entirely)
- CSS regex extraction (bookmarklet uses browser's native CSS parser)
- "Paste your CSS" textarea
- Color naming (beyond hue family grouping)
- Saving/bookmarking extracted palettes
- Mobile support (bookmarklet is desktop-only)

## Quality Checklist

### Blocking (must pass to ship)

- [ ] All Must Have ACs passing
- [ ] All Error Criteria ACs passing
- [ ] All scope items implemented
- [ ] No regressions in existing 84 tests
- [ ] Bookmarklet works on Chrome, Firefox, Safari, Edge
- [ ] Bookmarklet `href` is properly encoded (no XSS in bookmarklet itself)
- [ ] Colors parsed via existing `parseColor()` (no duplicate parsing logic)
- [ ] Page follows existing layout pattern (PageHeader, semantic tokens, responsive)
- [ ] Modal uses Lyse Registry `modal` + `action-card` components
- [ ] URL params parsed safely (malformed input → graceful fallback)

### Advisory (should pass, not blocking)

- [ ] All Should Have ACs passing
- [ ] Color clustering produces visually meaningful groups
- [ ] Bookmarklet tested on 10+ popular websites
- [ ] Onboarding is clear enough for first-time users without prior bookmarklet knowledge

## Test Strategy (MANDATORY)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | Detected | Vitest |
| E2E framework | Not configured | No Playwright/Cypress |
| Test DB | N/A | No database |
| Mock inventory | 0 existing mocks | All tests are pure function tests |

### AC → Test Mapping

| AC | Test Type | Test Intention |
|----|-----------|----------------|
| AC-1 | Manual | Page loads with onboarding when no colors in URL |
| AC-2 | Manual | Modal opens with 4 Action Cards |
| AC-3 | Manual | Bookmarklet extracts colors and opens Magiklch (test on real sites) |
| AC-4 | Unit | `clusterByHue(colors)` groups correctly, neutrals separated |
| AC-5 | Manual | Click swatch → clipboard + toast |
| AC-6 | Manual | Click generate → navigates to /?h=X&c=Y |
| AC-7 | Manual | Visual check: header, sidebar, layout consistency |
| AC-E1 | Manual | /steal without params → onboarding state |
| AC-E2 | Manual | /steal?colors= (empty) → empty state message |

### Failure Mode Tests (MANDATORY)

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E2 | Manual: bookmarklet on CSP-strict site — fails silently, no crash | Advisory |
| Error Journey | E3 | Manual: 0 colors extracted → empty state | BLOCKING |
| Edge Case | EC4 | Unit: URL params parsing handles malformed/truncated input | BLOCKING |
| Edge Case | EC5 | Unit: achromatic detection (chroma < 0.02) | BLOCKING |
| Failure Hypothesis | FH-1 | Unit: clustering is stable with varied inputs (all neutrals, single hue, many hues) | BLOCKING |

### Mock Boundary

| Dependency | Strategy | Justification |
|------------|----------|---------------|
| Clipboard API | Manual test | Browser API, not mockable in Vitest |
| Bookmarklet execution | Manual test on real sites | Requires real browser DOM context |

### TDD Commitment

All pure function tests (clusterer, URL param parsing) written BEFORE implementation (RED → GREEN → REFACTOR).
Manual tests for bookmarklet + UI verified during ship.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CSP blocks bookmarklet on some sites | MED | LOW | Most public/marketing sites allow inline JS. Logged-in apps may block. Accept as limitation. |
| Hue clustering produces meaningless groups | MED | LOW | Test with real sites, use 30° hue threshold (adjustable) |
| Users don't understand bookmarklet concept | MED | MED | "How it works" modal with Action Cards, clear one-line instruction |
| Bookmarklet `document.styleSheets` access blocked by cross-origin stylesheets | MED | MED | `try/catch` around cross-origin sheet access, extract from inline styles + computed styles as fallback |
| URL param too long with many colors | LOW | LOW | Cap at 50 colors in bookmarklet, sort by frequency/prominence |

**Kill criteria:** If bookmarklet fails on >30% of tested sites due to CSP or cross-origin restrictions, consider a browser extension (more capabilities, more maintenance).

## State Machine

```
┌─────────────────┐
│  /steal page     │
│  reads URL params│
└────────┬────────┘
         │
    has colors?
    ┌────┴────┐
    no        yes
    │          │
    ▼          ▼
[onboarding] [parsing]
    │              │
    │         parse + cluster
    │              │
    │         ┌────┴────┐
    │      0 colors   N colors
    │         │          │
    │         ▼          ▼
    │     [empty]    [results]
    │
    └── user clicks "How it works" → [modal open]
```

States: onboarding | parsing | results | empty | modal open
Simpler than server proxy — no fetching/validating/timeout states.

## Analysis

### Assumptions Challenged

| Assumption | Evidence For | Evidence Against | Verdict |
|------------|-------------|-----------------|---------|
| `document.styleSheets` gives access to all CSS colors on a page | Same-origin stylesheets are fully readable via CSSOM; computed styles always accessible | Cross-origin stylesheets (CDN-hosted CSS) throw `SecurityError` when accessing `.cssRules`. Workaround: `getComputedStyle()` on visible elements still works. | VALID — combined approach (CSSOM + computed styles) covers most cases |
| Users understand the bookmarklet concept | Bookmarklets have existed since the 90s; drag-and-drop is intuitive | Most modern users have never used a bookmarklet; the concept of "drag a button to your browser" is unfamiliar | RISKY — "How it works" modal is critical. Must be crystal clear. |
| Hue-based clustering produces useful groups | Human color perception groups by hue family naturally | Some sites use very close hues that might split; monochromatic sites produce one giant group | RISKY — need tunable threshold, test with real data |
| 50 colors cap fits in URL params | 50 hex values × 7 chars = 350 chars, well under 2000 char safe limit | Some sites may have 200+ unique colors; cap means we lose some | VALID — 50 most prominent colors is enough for palette analysis |

### Blind Spots

1. **[UX]** No visual preview of the source site — users can't cross-reference extracted colors with the original design.
   Why it matters: Colors out of context are less useful. V2 could pass the site URL in params and show a favicon.

2. **[Technical]** Cross-origin stylesheets (Google Fonts CSS, CDN-hosted frameworks) will throw `SecurityError` on `.cssRules` access.
   Why it matters: Some colors may be missed. Mitigated by `getComputedStyle()` fallback on DOM elements.

3. **[Data]** No persistence — extracted palettes disappear on page leave.
   Why it matters: Users may want to compare multiple sites. The URL is shareable though — they can bookmark the results URL.

### Failure Hypotheses

| IF | THEN | BECAUSE | Severity | Mitigation |
|----|------|---------|----------|------------|
| Users don't understand what a bookmarklet is | Feature has 0 activation | The concept is unfamiliar to modern web users | HIGH | "How it works" modal with Action Cards, clear visual instruction, consider animated GIF/illustration in V2 |
| Cross-origin stylesheets block `.cssRules` access | Missing colors from CDN-hosted CSS | Browser security prevents reading cross-origin CSS rules | MED | Fallback to `getComputedStyle()` on visible DOM elements; combine both approaches |
| Extracted colors are mostly grays/neutrals | Result looks useless, user bounces | Real sites have many neutral shades and few brand colors | MED | Sort clusters: chromatic first, neutrals last. Show chromatic colors prominently. |

### The Real Question

Confirmed — bookmarklet architecture is the right approach. It accesses computed styles (works on ALL sites), requires zero server infrastructure, and keeps the app pure client-side. The main risk is user comprehension of the bookmarklet concept — the "How it works" modal with Action Cards is the critical UX piece.

### Open Items

- [question] Feature name: "Steal" still TBD. → question (user decides)
- [risk] Cross-origin stylesheet access needs `try/catch` + computed style fallback → update spec (added to bookmarklet implementation)
- [improvement] Could pass source URL in params for favicon/context display → no action (V2)
- [improvement] Animated illustration in "How it works" modal → no action (V2, see if text Action Cards are sufficient first)

## Notes

Spec rewritten after spec-review pivot: server proxy → bookmarklet architecture. All SSRF/rate-limiting/server concerns eliminated.

### Ship Retro (2026-03-11)
**Estimate vs Actual:** 5h → ~4h (80%)
**What worked:** Bookmarklet architecture was the right call — zero server infra, works on all sites. Spec review caught the server proxy problem before any code was written. Frequency-based color ranking was the key insight for extraction quality.
**What didn't:** Initial bookmarklet read stylesheets (too noisy) + computed styles. Took 3 iterations to find the right balance: computed-styles-only + visibility filter + frequency ranking. Should have started with computed-only from the start.
**Next time:** For browser-context extraction, always start with computed styles (ground truth) and add secondary sources only if needed. Don't over-filter visibility — let frequency sorting handle relevance.

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | Create bookmarklet JS | [x] Complete | 1 |
| 2 | Create color clusterer + tests | [x] Complete | 1 |
| 3 | Create /steal page + shell (two modes) | [x] Complete | 1 |
| 4 | Create "How it works" modal with Action Cards | [x] Complete | 1 |
| 5 | Create extracted palette display components | [x] Complete | 1 |
| 6 | Wire "Generate palette" to generator | [x] Complete | 1 |
| 7 | Add empty state for 0 colors | [x] Complete | 1 |
| 8 | Add "Steal" to sidebar nav | [x] Complete | 1 |
| 9 | Write unit tests for clusterer | [x] Complete | 1 |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-11T00:00:00Z | - | Created |
| spec-review | 2026-03-11T00:00:00Z | - | Pivoted from server proxy to bookmarklet architecture |
| spec-update | 2026-03-11T00:00:00Z | - | Updated with bookmarklet arch, Action Card modal, removed paste CSS |
