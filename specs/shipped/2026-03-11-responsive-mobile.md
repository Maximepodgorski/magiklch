---
title: Responsive Mobile Layout
status: shipped
shipped: 2026-03-11
created: 2026-03-11
estimate: 5h
tier: standard
---

# Responsive Mobile Layout

## Context

Magiklch is desktop-only. On mobile (375px), the sidebar eats 224px leaving ~150px for content. Generator controls, swatch grids, and steal page all overflow or become unusable. Goal: make every page mobile-usable (reference + copy workflow), not mobile-optimized (full generation workflow).

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `components/layout/sidebar.tsx` | MODIFY | CSS-first hidden on mobile (`hidden lg:flex`), overlay drawer via portal on mobile |
| `components/layout/sidebar-context.tsx` | MODIFY | Add `close()`, `pathname` auto-close, body scroll lock |
| `components/layout/header.tsx` | MODIFY | Add hamburger button (mobile only) with `aria-expanded`/`aria-controls` |
| `components/layout/page-header.tsx` | MODIFY | Responsive padding (`px-4 lg:px-10`) |
| `app/layout.tsx` | MODIFY | Sidebar architecture: CSS-first visibility, overlay portal |
| `components/palette/generator-shell.tsx` | MODIFY | Controls grid responsive + swatch row `overflow-x-auto` with `min-w-[44px]` |
| `components/palette/shade-card.tsx` | AFFECTED | Swatch sizing from parent changes |
| `components/random/random-shell.tsx` | MODIFY | Same swatch overflow fix as generator |
| `components/steal/steal-shell.tsx` | MODIFY | Mobile detection: show "desktop feature" notice instead of bookmarklet flow |
| `components/layout/export-footer.tsx` | MODIFY | Responsive label: "Copy" on mobile, "Copy Variables" on desktop |
| `components/docs/page.tsx` | AFFECTED | Padding adjustments only |

**Files:** 0 create | 8 modify | 3 affected
**Reuse:** Existing `useSidebar()` hook, Tailwind responsive utilities, existing sidebar open/close logic
**Breaking changes:** None
**New dependencies:** None

## User Journey (MANDATORY)

### Primary Journey

ACTOR: Developer/designer on mobile phone (375px viewport)
GOAL: Browse palettes, look up shades, copy color values on the go
PRECONDITION: User visits magiklch.vercel.app on mobile browser

1. User opens site on mobile
   -> System shows header with hamburger icon (left) + logo + theme pill
   -> Sidebar is hidden via CSS (`hidden lg:flex`), no hydration flash
   -> User sees generator page at full width

2. User taps hamburger icon
   -> System slides sidebar in from left as overlay with backdrop
   -> Focus moves to first nav link, body scroll locked
   -> User sees navigation links

3. User taps a nav link (e.g., Catalogue)
   -> System closes sidebar overlay, focus returns to hamburger
   -> User navigates to catalogue page, full-width grid

4. User presses Escape or taps backdrop
   -> System closes sidebar overlay, focus returns to hamburger

5. User uses generator on mobile
   -> Controls stack vertically (seed color, shades, gamut)
   -> Swatch row scrolls horizontally with min 44px per swatch
   -> LCH sliders stack vertically (already works)

6. User taps a swatch
   -> Color value copied to clipboard, toast confirms

POSTCONDITION: All features accessible and usable on mobile viewport

### Error Journeys

E1. Sidebar overlay blocks interaction
   Trigger: User opens sidebar but taps content area behind it
   1. User taps backdrop
      -> System closes sidebar, restores focus to hamburger
   2. User continues interacting with content
   Recovery: Sidebar dismissed, content interactive, body scroll unlocked

E2. Orientation change mid-use
   Trigger: User rotates phone from portrait to landscape
   1. System reflows layout to wider viewport
      -> If crosses 1024px: sidebar becomes inline, overlay dismissed
   Recovery: Layout adjusts without losing state

E3. Keyboard user navigates with sidebar open
   Trigger: User tabs through sidebar links
   1. Focus is trapped within sidebar (cannot tab to content behind backdrop)
   2. User presses Escape -> sidebar closes, focus returns to hamburger
   Recovery: Focus management correct

### Edge Cases

EC1. Tablet (768px): Gets overlay sidebar (below 1024px threshold).
EC2. Very small screen (<320px): Swatch row scrolls horizontally, content remains accessible.
EC3. Sidebar open + iOS keyboard visible: Overlay uses `dvh` for height, unaffected by keyboard.
EC4. Steal page on mobile: Bookmarklet drag is impossible on touch, show "desktop feature" notice.

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

- [x] AC-1: GIVEN viewport < 1024px WHEN page loads THEN sidebar is hidden via CSS (no JS flash), content uses full width
- [x] AC-2: GIVEN viewport < 1024px WHEN user taps hamburger THEN sidebar slides in as overlay with backdrop, focus moves inside, body scroll locked
- [x] AC-3: GIVEN sidebar overlay is open WHEN user taps backdrop, nav link, or presses Escape THEN sidebar closes, focus returns to hamburger
- [x] AC-4: GIVEN viewport < 1024px WHEN viewing generator THEN controls stack vertically (1 column)
- [x] AC-5: GIVEN viewport < 1024px WHEN viewing generator/random THEN swatch row scrolls horizontally, each swatch >= 44px wide
- [x] AC-6: GIVEN viewport < 1024px WHEN viewing any page THEN horizontal padding is 16-20px (not 40-80px)
- [x] AC-7: GIVEN viewport >= 1024px WHEN page loads THEN current desktop layout is unchanged
- [x] AC-8: GIVEN viewport < 1024px WHEN viewing steal page THEN bookmarklet flow is replaced by "desktop feature" notice
- [x] AC-9: GIVEN sidebar overlay is open WHEN user navigates (route change) THEN sidebar auto-closes

### Error Criteria (BLOCKING)

- [x] AC-E1: GIVEN sidebar overlay is open WHEN user taps outside THEN sidebar closes and content is interactive
- [x] AC-E2: GIVEN viewport changes (rotate/resize) WHEN crossing 1024px threshold THEN layout transitions correctly
- [x] AC-E3: GIVEN sidebar overlay is open WHEN keyboard user tabs THEN focus stays trapped within sidebar

### Should Have

- [x] AC-10: GIVEN viewport < 1024px WHEN export footer renders THEN copy button label is shortened ("Copy" not "Copy Variables")
- [x] AC-11: GIVEN `prefers-reduced-motion: reduce` WHEN sidebar opens/closes THEN transition is instant (no slide)

## Scope

- [x]1. Mobile sidebar: CSS-first hidden (`hidden lg:flex`), overlay drawer with backdrop, focus trap, Escape close, scroll lock, `dvh` height -> AC-1, AC-2, AC-3, AC-E1, AC-E3
- [x]2. Header: hamburger button on mobile (`aria-expanded`, `aria-controls`, `aria-label`), current layout on desktop -> AC-2, AC-7
- [x]3. Sidebar context: add `close()`, `usePathname` auto-close, body scroll lock toggle -> AC-9, AC-3, AC-E2
- [x]4. Generator controls: responsive grid (stack on mobile) -> AC-4
- [x]5. Swatch grids: `overflow-x-auto` + `min-w-[44px]` per swatch (keep inline `gridTemplateColumns`) -> AC-5
- [x]6. Page padding + export footer: responsive padding across all pages, shorter copy label on mobile -> AC-6, AC-10
- [x]7. Steal page: mobile detection, show "desktop feature" notice instead of bookmarklet flow -> AC-8
- [x]8. Reduced motion: sidebar transition respects `prefers-reduced-motion` -> AC-11

### Out of Scope

- Bottom tab navigation (consider for v2)
- Swipe gesture to open sidebar
- PWA / service worker
- Mobile-specific color picker
- Touch-optimized slider controls
- Refactoring swatch grid inline styles to Tailwind classes (keep inline, add horizontal scroll)

## Quality Checklist

### Blocking (must pass to ship)

- [x]All Must Have ACs passing
- [x]All Error Criteria ACs passing
- [x]All scope items implemented
- [x]No regressions in existing tests
- [x]Desktop layout visually unchanged at >= 1024px
- [x]No horizontal overflow on 375px viewport (except intentional swatch scroll)
- [x]Sidebar overlay has proper z-index (above content, below modals)
- [x]Hamburger has `aria-expanded`, `aria-controls`, `aria-label`
- [x]Focus trapped in open sidebar, Escape closes, focus returns to trigger
- [x]Body scroll locked when sidebar overlay open
- [x]No hardcoded secrets or credentials

### Advisory (should pass, not blocking)

- [x]All Should Have ACs passing
- [x]Touch targets >= 44px (WCAG 2.5.5)
- [x]Smooth sidebar transition (200-300ms)
- [x]Backdrop opacity transition
- [x]Sidebar uses `dvh` not `vh` (iOS Safari dynamic viewport)
- [x]`prefers-reduced-motion` respected on sidebar animation

## Test Strategy (MANDATORY)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | detected | vitest |
| E2E framework | not configured | no playwright/cypress |
| Test DB | N/A | client-side only |
| Mock inventory | 0 | no mocks needed |

### AC -> Test Mapping

| AC | Test Type | Test Intention |
|----|-----------|----------------|
| AC-1 | Manual | Verify sidebar hidden on mobile load, no flash/CLS |
| AC-2 | Manual | Verify hamburger opens overlay with focus + scroll lock |
| AC-3 | Manual | Verify backdrop/link/Escape closes sidebar, focus returns |
| AC-4 | Manual | Verify generator controls stack |
| AC-5 | Manual | Verify swatch row scrolls horizontally, swatches >= 44px |
| AC-6 | Manual | Verify reduced padding |
| AC-7 | Manual | Verify desktop unchanged |
| AC-8 | Manual | Verify steal page shows desktop notice on mobile |
| AC-9 | Manual | Verify sidebar closes on route change |
| AC-E3 | Manual | Verify focus trap with Tab key |

### Failure Mode Tests (MANDATORY)

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E1 | Manual: backdrop tap closes sidebar | BLOCKING |
| Error Journey | E2 | Manual: resize across breakpoint | BLOCKING |
| Error Journey | E3 | Manual: keyboard focus trap in sidebar | BLOCKING |
| Failure Hypothesis | FH-1 | Manual: verify no sidebar flash on mobile load | BLOCKING |
| Failure Hypothesis | FH-2 | Manual: verify sidebar closes on navigation | BLOCKING |
| Failure Hypothesis | FH-3 | Manual: verify iOS Safari scroll not bleeding through backdrop | Advisory |

### Mock Boundary

No external dependencies. All client-side.

### TDD Commitment

Pure UI changes — manual verification via Chrome DevTools responsive mode + Safari iOS simulator.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Sidebar z-index conflicts with modals/toasts | MED | LOW | Test modal + sidebar open simultaneously |
| iOS Safari scroll bleed through backdrop | MED | MED | Body `overflow: hidden` when drawer open |
| Swatch horizontal scroll not discoverable | LOW | MED | Add subtle scroll indicator or shadow |
| Export footer overflow on 375px | MED | HIGH | Shorten label on mobile |
| Performance: sidebar animation janky on low-end | LOW | LOW | Use `transform` not `width`, respect reduced motion |

**Kill criteria:** If sidebar overlay creates z-index cascade affecting more than 3 existing components, simplify to a full-screen nav instead.

## State Machine

```
Sidebar on mobile:

[hidden] --hamburger tap--> [overlay-open] { focus trap ON, scroll lock ON }
[overlay-open] --backdrop tap--> [hidden] { focus to hamburger }
[overlay-open] --Escape key--> [hidden] { focus to hamburger }
[overlay-open] --nav link tap--> [hidden] + navigate { focus to hamburger }
[overlay-open] --pathname change--> [hidden] { auto-close }
[overlay-open] --viewport >= 1024px--> [inline-open] { scroll lock OFF, focus trap OFF }

Sidebar on desktop:

[inline-open] --viewport < 1024px--> [hidden]
[inline-open] --toggle--> [inline-closed]
[inline-closed] --toggle--> [inline-open]
```

States: hidden (mobile default), overlay-open (mobile drawer), inline-open (desktop), inline-closed (desktop collapsed)
Invalid: overlay-open on desktop, inline on mobile

## Analysis

### Assumptions Challenged

| Assumption | Evidence For | Evidence Against | Verdict |
|------------|-------------|-----------------|---------|
| `useState(true)` + JS viewport check is sufficient | Common React pattern | SSR renders sidebar open, causes CLS on mobile hydration. CSS-first (`hidden lg:flex`) eliminates flash entirely | WRONG — use CSS-first approach |
| Swatch grid should refactor to Tailwind classes | Cleaner code | `repeat(${N}, 1fr)` is runtime data, Tailwind JIT purges dynamic classes. Inline style is correct tool. | WRONG — keep inline style, add `overflow-x-auto` |
| Export footer stays as-is | Only 2 controls | At 375px: 140px Select + "Copy Variables" button + padding overflows | WRONG — needs responsive label |
| Steal page only needs layout fix | Padding is broken | Bookmarklet drag is impossible on touch devices. Entire flow is desktop-only. | WRONG — needs mobile-specific state |
| 1024px breakpoint is consistent | Tailwind `lg` standard | LchSliders uses `md` (768px), creating a mismatch zone | VALID — acceptable, different concerns |
| Hamburger menu is discoverable on mobile | Universal pattern since 2012 | Studies show reduced discovery | VALID — standard for tool apps |
| No bottom nav needed for MVP | Keeps scope small | Bottom nav has higher engagement | RISKY — acceptable for v1 |

### Blind Spots

1. **[A11y]** Sidebar overlay is a de facto modal: needs focus trap, Escape close, focus restoration to trigger. Without these, WCAG 2.4.3 failure.
   Why it matters: Keyboard and screen reader users cannot use the app.

2. **[A11y]** Hamburger button needs `aria-expanded`, `aria-controls="sidebar"`, `aria-label="Open navigation"`. Without it, screen readers get no state feedback.
   Why it matters: Critical for AT users.

3. **[iOS]** Body scroll bleed: iOS Safari scrolls content behind overlay by default. Requires `overflow: hidden` on body when drawer open.
   Why it matters: Users scroll the wrong thing, disorienting.

4. **[Touch]** Swatches at 12 cols on 375px = ~28px each, below 44px WCAG minimum. Horizontal scroll with min-width is the fix.
   Why it matters: Swatches are the core interaction.

5. **[Platform]** Steal page bookmarklet is desktop-only. Polishing layout on mobile for a broken flow is wasted effort.
   Why it matters: Mobile users see instructions they can't follow.

6. **[Reduced motion]** Sidebar slide animation must respect `prefers-reduced-motion: reduce`.
   Why it matters: Accessibility requirement.

### Failure Hypotheses

| IF | THEN | BECAUSE | Severity | Mitigation |
|----|------|---------|----------|------------|
| Sidebar `useState(true)` on SSR | Mobile users see sidebar flash then collapse (CLS) | Server renders open state, JS closes after hydration | HIGH | CSS-first: `hidden lg:flex` |
| No `pathname` listener in context | Drawer stays open after navigation | No auto-close on route change | HIGH | `useEffect` on `pathname` calling `close()` |
| Swatch row stays 12-col inline with no overflow | 28px swatches, untappable | Inline styles override Tailwind responsive | HIGH | `overflow-x-auto` + `min-w-[44px]` |
| No focus trap on overlay | Keyboard users tab behind backdrop | No `inert` or focus loop | HIGH | Focus trap + Escape handler |
| Export footer overflows on 375px | Button truncated or horizontal scroll | 140px Select + button + padding > 375px | MED | Shorter label on mobile |
| iOS scroll bleed through backdrop | Users scroll wrong content | iOS momentum scrolling bypasses overlay | MED | Body `overflow: hidden` |

### The Real Question

The mobile use case is **reference and copy**, not full palette generation. The spec correctly focuses on making navigation work (sidebar drawer) and content readable (swatch scroll, padding). Generator controls stacking is secondary. Steal page needs platform awareness, not layout polish.

Confirmed: the spec now solves the right problems after review revisions.

### Open Items

- [improvement] Consider bottom nav for v2 if mobile usage grows -> no action
- [improvement] Swipe-to-close on drawer -> no action (v2)
- [gap] iOS Safari `oklch()` rendering edge cases -> explore at ship time

## Notes

Spec review applied: 2026-03-11. Perspectives: Mobile UX Designer, Frontend Engineer, Accessibility Specialist, Skeptic. Key revisions: CSS-first sidebar (no hydration flash), horizontal scroll swatches (keep inline styles), focus trap + a11y on drawer, Steal page mobile detection, export footer responsive label.

### Ship Retro (2026-03-11)
**Estimate vs Actual:** 5h → ~2h (250% faster)
**What worked:** CSS-first approach (`hidden lg:flex`) eliminated SSR hydration flash entirely — no JS viewport detection needed. Spec review caught 8 critical issues (focus trap, scroll lock, semantic conflicts) before implementation, saving rework. Parallel review agents (3 perspectives) found 4 blockers efficiently.
**What didn't:** Initial `handleClose` used `toggleMobile` instead of a dedicated `closeMobile` — rapid Escape press could re-open. Caught in code review, but should have been caught at implementation. Also, `<aside role="dialog">` semantic conflict was introduced and caught in review.
**Next time:** Always expose a dedicated `close` action (not toggle) for overlay patterns. Never put `role="dialog"` on landmark elements (`aside`, `nav`, `main`) — use a neutral `<div>`.

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | Mobile sidebar overlay drawer | done | 1 |
| 2 | Header hamburger button | done | 1 |
| 3 | Sidebar context enhancements | done | 1 |
| 4 | Generator controls responsive | done | 1 |
| 5 | Swatch grids horizontal scroll | done | 1 |
| 6 | Page padding + export footer | done | 1 |
| 7 | Steal page mobile notice | done | 1 |
| 8 | Reduced motion support | done | 1 |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-11T13:55:00 | - | Created |
| spec-review | 2026-03-11T14:10:00 | - | 4 perspectives, 8 findings merged |
| ship | 2026-03-11T14:35:00 | - | All 8 scopes implemented, quality gates passed |
| review | 2026-03-11T14:40:00 | - | Deep review (3 agents), 4 FAILs found |
| fix | 2026-03-11T14:50:00 | - | 4 FAILs + 2 WARNs fixed, review CLEAN |
| done | 2026-03-11T14:55:00 | ~2h | Shipped |
