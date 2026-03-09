---
title: "MagicOKLCH — Sidebar Navigation Layout"
status: backlog
created: 2026-03-09
estimate: 3h
tier: standard
depends: none
---

# MagicOKLCH — Sidebar Navigation Layout

## Context

Refactor the app layout from top header navigation to sidebar + slim header. The current layout stacks Logo + nav links + theme toggle in a single horizontal header bar. The new layout splits concerns: **header** = logo + external links (GitHub, theme), **sidebar** = internal page navigation.

This gives more vertical space for palette content (the product) and creates a more app-like feel vs. a website feel.

### Current Layout

```
┌──────────────────────────────────────────────────────┐
│  MagicOKLCH    Catalogue  Random         ThemeToggle │
├──────────────────────────────────────────────────────┤
│                                                      │
│                     Main content                     │
│                                                      │
├──────────────────────────────────────────────────────┤
│                       Footer                         │
└──────────────────────────────────────────────────────┘
```

### Target Layout

```
┌──────────────────────────────────────────────────────┐
│  MagicOKLCH                          GitHub  Theme ☾ │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  Generator │              Main content               │
│  Catalogue │                                         │
│  Random    │                                         │
│            │                                         │
│            │                                         │
│            │                                         │
│  ────────  │                                         │
│  GitHub ↗  │                                         │
│  LinkedIn↗ │                                         │
│            ├─────────────────────────────────────────┤
│            │                Footer                   │
└────────────┴─────────────────────────────────────────┘
```

Sidebar has two zones: **top** = page nav (Generator, Catalogue, Random), **bottom** = external links (GitHub, LinkedIn) pushed to the bottom with `mt-auto`.

### Mobile (< 768px)

Sidebar collapses. Hamburger icon in header opens a sheet/drawer overlay with nav links.

```
┌──────────────────────────┐
│  ☰  MagicOKLCH    ☾  GH │
├──────────────────────────┤
│                          │
│       Main content       │
│                          │
├──────────────────────────┤
│         Footer           │
└──────────────────────────┘
```

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `components/layout/sidebar.tsx` | CREATE | Left nav sidebar — **top:** page nav (Generator, Catalogue, Random) with active state. **Bottom:** external links (GitHub, LinkedIn) with external-link icon, open in new tab. Collapsible on desktop (icon-only mode). |
| `components/layout/header.tsx` | MODIFY | Remove nav links. Keep logo (left). Add GitHub link + ThemeToggle (right). Add hamburger trigger for mobile sidebar. |
| `components/layout/mobile-nav.tsx` | CREATE | Sheet/drawer overlay for mobile nav. Triggered by hamburger in header. |
| `app/layout.tsx` | MODIFY | Change flex-col layout to sidebar + main grid. Sidebar is persistent on desktop, hidden on mobile. |
| `components/layout/footer.tsx` | MODIFY | Footer sits inside main content area (not full-width), right of sidebar. Update GitHub link URL (repo renamed to magic-oklch). |

**Files:** 2 create | 3 modify | 0 affected
**Reuse:** Lyse Button (nav items, hamburger), Lyse Tooltip (icon-only sidebar labels)
**Breaking changes:** Layout structure changes — all pages affected visually, no API changes.
**New dependencies:** None (Sheet/drawer from Radix via Lyse if available, otherwise CSS-only with dialog element)

## User Journey (MANDATORY)

### Primary Journey — Desktop Navigation

ACTOR: Design engineer on desktop
GOAL: Navigate between Generator, Catalogue, Random
PRECONDITION: App loaded on viewport ≥ 768px

1. User sees sidebar on the left with 3 nav items: Generator, Catalogue, Random
   → Current page is highlighted (active state)
   → Header shows "MagicOKLCH" logo (left), GitHub link + ThemeToggle (right)

2. User clicks "Catalogue" in sidebar
   → System navigates to `/catalogue`
   → Sidebar active state moves to "Catalogue"
   → Main content area shows catalogue page

3. User clicks "MagicOKLCH" logo in header
   → System navigates to `/` (generator)

POSTCONDITION: User navigated between pages using sidebar

### Primary Journey — Mobile Navigation

ACTOR: User on phone
GOAL: Navigate between pages
PRECONDITION: App loaded on viewport < 768px

1. User sees slim header with hamburger (left), logo (center), GitHub + Theme (right)
   → No sidebar visible

2. User taps hamburger icon
   → Sheet/drawer slides in from left with nav links
   → Background is dimmed

3. User taps "Random"
   → Sheet closes
   → System navigates to `/random`

POSTCONDITION: User navigated via mobile nav sheet

### Edge Cases

EC1. Sidebar + narrow main content: On viewports 768–1024px, sidebar may be icon-only (collapsed) by default to give more space to palette grid
EC2. Active state on sub-routes: `/catalogue` → Catalogue active, `/random` → Random active, `/` → Generator active
EC3. Skip-to-content: Keep working — focus jumps past sidebar to `#main-content`

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN desktop viewport (≥ 768px) WHEN app loads THEN sidebar is visible on the left with nav links (top: Generator, Catalogue, Random) and external links (bottom: GitHub, LinkedIn)
- [ ] AC-2: GIVEN sidebar WHEN user is on `/catalogue` THEN "Catalogue" nav item has active styling
- [ ] AC-3: GIVEN header WHEN rendered THEN shows logo (left) and GitHub link + ThemeToggle (right) — no page nav links in header
- [ ] AC-4: GIVEN header GitHub link WHEN clicked THEN opens `https://github.com/Maximepodgorski/magic-oklch` in new tab
- [ ] AC-4b: GIVEN sidebar GitHub link WHEN clicked THEN opens `https://github.com/Maximepodgorski/magic-oklch` in new tab (`target="_blank"`, `rel="noopener noreferrer"`)
- [ ] AC-4c: GIVEN sidebar LinkedIn link WHEN clicked THEN opens LinkedIn profile in new tab
- [ ] AC-5: GIVEN mobile viewport (< 768px) WHEN app loads THEN sidebar is hidden, hamburger icon visible in header
- [ ] AC-6: GIVEN mobile viewport WHEN user taps hamburger THEN nav sheet/drawer opens with nav links (Generator, Catalogue, Random) + external links (GitHub, LinkedIn)
- [ ] AC-7: GIVEN mobile nav sheet WHEN user taps a page link THEN sheet closes and navigates to page
- [ ] AC-7b: GIVEN mobile nav sheet WHEN user taps an external link THEN link opens in new tab and sheet closes
- [ ] AC-8: GIVEN the layout WHEN rendered THEN footer sits inside main content area (right of sidebar on desktop)
- [ ] AC-9: GIVEN skip-to-content link WHEN Tab pressed THEN focus skips sidebar and jumps to `#main-content`
- [ ] AC-10: GIVEN `npm run lint && npm run typecheck && npm run build` WHEN run THEN all pass clean

### Should Have

- [ ] AC-11: GIVEN desktop sidebar WHEN viewport is 768–1024px THEN sidebar collapses to icon-only mode with tooltips on hover
- [ ] AC-12: GIVEN sidebar nav items WHEN focused via keyboard THEN visible focus ring and navigable with Arrow keys
- [ ] AC-13: GIVEN mobile nav sheet WHEN opened THEN focus is trapped inside, Escape closes it

## Scope

- [ ] 1. Create `components/layout/sidebar.tsx` — **Top:** nav items with icons, active state via `usePathname()`. **Bottom** (`mt-auto`): GitHub + LinkedIn external links with external-link icon, `target="_blank"`. Separator between zones. Responsive collapse to icon-only. → AC-1, AC-2, AC-4b, AC-4c, AC-11
- [ ] 2. Refactor `components/layout/header.tsx` — remove nav links, add GitHub link (icon + label), keep ThemeToggle, add hamburger for mobile → AC-3, AC-4, AC-5
- [ ] 3. Create `components/layout/mobile-nav.tsx` — sheet overlay triggered by hamburger, renders same content as sidebar (page nav + external links), auto-close on navigation → AC-6, AC-7, AC-7b, AC-13
- [ ] 4. Refactor `app/layout.tsx` — replace `flex-col` with `grid` or `flex-row` layout: `[sidebar | [header + main + footer]]`. Sidebar hidden on mobile via responsive class. → AC-1, AC-5, AC-8
- [ ] 5. Update `components/layout/footer.tsx` — update GitHub URL to magic-oklch repo, ensure footer is inside main content area → AC-8
- [ ] 6. Verify skip-to-content, keyboard nav, build pass → AC-9, AC-10, AC-12

### Out of Scope

- Sidebar settings/preferences section
- Sidebar user profile / account
- Sidebar branding customization
- Nested sidebar sub-menus
- Sidebar resize/drag

## Quality Checklist

### Blocking

- [ ] All Must Have ACs (AC-1 through AC-10, AC-4b, AC-4c, AC-7b) passing
- [ ] Nav links removed from header
- [ ] Sidebar shows active state matching current route
- [ ] Sidebar bottom section has GitHub + LinkedIn external links opening in new tab
- [ ] Mobile hamburger opens nav sheet
- [ ] Footer inside main content area (not full-width below sidebar)
- [ ] Skip-to-content still works
- [ ] `npm run lint && npm run typecheck && npm run build` clean
- [ ] Dark mode correct on sidebar, header, mobile sheet

### Advisory

- [ ] AC-11, AC-12, AC-13 passing
- [ ] Sidebar transition/animation smooth (≤ 200ms)
- [ ] No layout shift on page transitions
- [ ] Sidebar width consistent (e.g., 240px expanded, 56px collapsed)

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Sidebar eats too much horizontal space on tablet | MED | MED | Icon-only collapse at 768–1024px (AC-11) |
| Mobile sheet needs Radix Dialog or similar | LOW | LOW | Use native `<dialog>` element if no Lyse component available |
| Palette grid responsive breakpoints need re-tuning | MED | HIGH | Test palette-grid at new effective content widths (content area is ~240px narrower) |

**Kill criteria:** None — reversible layout change. If sidebar feels wrong after build, revert to header nav.

## Analysis

### Assumptions Challenged

| # | Assumption | Evidence For | Evidence Against | Verdict |
|---|------------|-------------|-----------------|---------|
| 1 | Sidebar > header for app-like tools | Standard pattern in dev tools (Figma, Linear, VS Code) | Simpler tools (oklch.com, coolors.co) use header | VALID — MagicOKLCH is a tool, not a landing page |
| 2 | 3 nav items justify a sidebar | Sidebar gives room to grow (export, settings, etc.) | Only 3 links feels sparse | VALID — future V2 features (multi-palette, harmony) will fill it |
| 3 | Footer inside main content area (not full-width) | Clean separation, sidebar is persistent | Some users expect full-width footer | VALID — app pattern, footer is minimal |

### The Real Question

Layout is a Type 2 decision (reversible). Ship fast. The real gain: palette grid gets the full vertical viewport instead of losing 56px to a header nav bar. For a visual tool, that vertical space matters.
