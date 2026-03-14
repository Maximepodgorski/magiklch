---
title: Blocks Page — Live Palette Preview
status: shipped
shipped: 2026-03-14
created: 2026-03-14
estimate: 5h
tier: standard
---

# Blocks Page — Live Palette Preview

## Context

Users generate palettes in Magiklch but can't see how they look in real UI. The Blocks page shows realistic UI templates (Auth login, Settings preferences) themed live by selecting a Brand palette and a Neutral palette from the catalogue. This turns Magiklch from a color tool into a design decision tool.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `app/blocks/page.tsx` | CREATE | Route + metadata, renders BlocksShell |
| `components/blocks/blocks-shell.tsx` | CREATE | Page orchestrator: tabs, color switchers, scoped CSS injection, preview area |
| `components/blocks/blocks-toolbar.tsx` | CREATE | Neutral/Brand palette selects with color dot previews |
| `components/blocks/auth-block.tsx` | CREATE | Auth login UI template (dark hero + form) |
| `components/blocks/settings-block.tsx` | CREATE | Settings/preferences UI template (banner + profile card) |
| `lib/palette-theme.ts` | CREATE | `brandScopeCss()` + `neutralScopeCss()` — generates scoped CSS (3 layers: primitives + semantic tokens + bridge tokens). Must emit bridge tokens (`--primary`, `--ring`, `--border`, etc.) explicitly — they do NOT auto-resolve via inheritance. Opacity tokens (`--root-opacity-brand-*`) recomputed as `color-mix()` |
| `lib/__tests__/palette-theme.test.ts` | CREATE | Unit tests for pure palette-to-CSS functions |
| `data/all-palettes.ts` | MODIFY | Export `BRAND_PALETTES` and `NEUTRAL_PALETTES` filtered arrays |
| `components/layout/sidebar.tsx` | MODIFY | Add "Blocks" nav item in Features group |
| `styles/lyse/semantic-colors.css` | AFFECTED | Read-only — semantic token mappings extracted for palette-theme.ts |
| `styles/lyse/shadcn-bridge.css` | AFFECTED | Read-only — bridge token mappings extracted for palette-theme.ts |

**Files:** 7 create | 2 modify | 2 affected
**Reuse:** `PageHeader`, `Button`, `Input`, `Checkbox`, `Toggle`, `BannerInfo`, `Badge` — all existing Lyse components. `Select`/`SelectTrigger`/`SelectContent`/`SelectItem` for the toolbar selectors (outside scope wrapper). `generatePalette()` from color-engine. `getPaletteById()` + `ALL_PALETTES` from data layer.
**Breaking changes:** None
**New dependencies:** None
**Portal constraint:** Block templates (auth-block, settings-block) MUST NOT use Portal-based components (Select, DropdownMenu, Modal, Tooltip). Radix Portals render into `document.body`, outside the `[data-blocks-scope]` wrapper, bypassing scoped CSS entirely. Use native `<select>`, static text, or non-portal alternatives inside templates. The toolbar selectors (blocks-toolbar.tsx) are outside the scope wrapper and can use Radix Select normally.

## User Journey (MANDATORY)

### Primary Journey

ACTOR: Designer/developer exploring color palettes
GOAL: Preview how a Brand + Neutral palette combination looks on real UI
PRECONDITION: User is on the Magiklch site

1. User clicks "Blocks" in sidebar
   → System navigates to `/blocks`
   → URL shows `/blocks?brand=orange&neutral=stone` (default params)
   → User sees page header, Login tab active, default palette (Stone neutral + Orange brand), auth block preview

2. User clicks "Preferences" tab
   → System swaps the preview to the settings block
   → User sees settings UI with current palette applied

3. User opens the Brand palette selector, sees color dot preview for each option
   → User selects "Blue"
   → URL updates to `?brand=blue&neutral=stone`
   → System regenerates scoped CSS with blue brand primitives + semantics + bridge
   → User sees all brand-colored elements (buttons, links, checkboxes, toggles, avatar) update to blue

4. User opens the Neutral palette selector
   → User selects "Slate"
   → URL updates to `?brand=blue&neutral=slate`
   → System regenerates scoped CSS with slate neutral primitives + semantics + bridge
   → User sees all neutral elements (backgrounds, borders, text) shift to slate tones

5. User switches between Login/Preferences tabs
   → Both blocks reflect the currently selected Brand + Neutral palette

POSTCONDITION: User has evaluated palette combinations on realistic UI and can make an informed color decision

### Error Journeys

E1. Invalid palette ID in state
   Trigger: `getPaletteById` returns undefined (corrupted state)
   1. System falls back to default palette (Orange brand / Stone neutral)
   → User sees default-themed blocks without error

### Edge Cases

EC1. Dark mode: User toggles site theme to dark → blocks adapt via `.dark` scoped semantic tokens
EC2. Rapid switching: User clicks palettes quickly → useMemo prevents unnecessary recalculation

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN user navigates to /blocks WHEN page loads THEN Login tab is active showing the auth block with default Orange brand + Stone neutral
- [ ] AC-2: GIVEN user is on blocks page WHEN clicking "Preferences" tab THEN the settings block replaces the auth block
- [ ] AC-3: GIVEN user selects "Blue" from Brand selector WHEN selection completes THEN all brand-colored elements (primary buttons, links, checkbox, toggle, avatar bg) display blue shades
- [ ] AC-4: GIVEN user selects "Slate" from Neutral selector WHEN selection completes THEN all neutral elements (backgrounds, borders, text colors) shift to slate tones
- [ ] AC-5: GIVEN palette is selected WHEN user switches tabs THEN the new block renders with the currently selected palettes (state persists across tabs)
- [ ] AC-6: GIVEN user is in dark mode WHEN viewing blocks THEN all semantic tokens resolve correctly for dark theme (backgrounds invert, text inverts)
- [ ] AC-7: GIVEN blocks page WHEN inspecting the color selectors THEN each shows 5 color dot previews of the palette shades before selection

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN an invalid palette ID WHEN generating scoped CSS THEN system falls back to default palette without crashing

### Should Have

- [ ] AC-8: GIVEN blocks page WHEN viewing on mobile (<lg) THEN page is usable (single column, horizontal scroll if needed for block)

## Scope

### Gate 1 — CSS Injection Validation (1h budget, BLOCKING)

Prove the scoped CSS approach works before building any templates. If Gate 1 takes >1.5h, STOP and reassess.

- [ ] 1. Create `palette-theme.ts` with `brandScopeCss()` and `neutralScopeCss()` (TDD) → AC-3, AC-4, AC-6
  - Must emit ALL 3 layers: primitives (`--root-color-brand-*`) + semantics (light/dark) + bridge (`--primary`, `--ring`, `--border`, etc.)
  - Must recompute opacity tokens (`--root-opacity-brand-*`) via `color-mix(in srgb, <hex> <alpha>%, transparent)` — hardcoded hex values in root-colors.css won't adapt
  - CSS selectors must quote the `useId()` value: `[data-blocks-scope=":r0:"]` (colons require quotes)
- [ ] 2. Add `BRAND_PALETTES` / `NEUTRAL_PALETTES` exports to `all-palettes.ts` → AC-3, AC-4, AC-7
- [ ] 3. Visual proof: minimal test page confirming brand + neutral switch works in both light and dark mode → gate pass

### Gate 2 — Templates + Shell (3-4h)

Only proceed after Gate 1 passes.

- [ ] 4. Create `auth-block.tsx` — login form matching screenshot exactly → AC-1, AC-2
  - NO Portal-based components (no Select, DropdownMenu, Modal, Tooltip from Radix)
- [ ] 5. Create `settings-block.tsx` — preferences form matching screenshot exactly → AC-1, AC-2
  - NO Portal-based components
- [ ] 6. Create `blocks-toolbar.tsx` — Neutral/Brand selects with color dots → AC-3, AC-4, AC-7
- [ ] 7. Create `blocks-shell.tsx` — orchestrator with tabs, toolbar, scoped CSS injection, URL state, preview area → AC-1, AC-2, AC-5, AC-E1
  - Palette state in URL params: `?brand=orange&neutral=stone`
- [ ] 8. Create `app/blocks/page.tsx` route → AC-1
- [ ] 9. Add "Blocks" to sidebar navigation → AC-1
- [ ] 10. Quality pass: lint + typecheck + build + tests → all ACs

### Out of Scope

- Dashboard block (future tab)
- Code tab in preview toolbar (not rendered — no inactive pills that create false promises)
- Export/copy palette from blocks page
- Mobile-optimized block layouts (blocks render at fixed width, page scrolls)

## Quality Checklist

### Blocking

- [ ] All Must Have ACs passing
- [ ] All Error Criteria ACs passing
- [ ] All scope items implemented
- [ ] No regressions in existing tests
- [ ] Semantic tokens used everywhere — no hardcoded colors except dark-on-dark testimonial card
- [ ] Scoped CSS resolves correctly in both light and dark mode
- [ ] Brand switching updates all brand-dependent tokens (background, border, text, icon, overlay, shadow, link)
- [ ] Neutral switching updates all neutral-dependent tokens (base bg, card, text, borders)

### Advisory

- [ ] Visual match with Pencil screenshots in `export/`
- [ ] All Should Have ACs passing
- [ ] Code follows existing component patterns (named exports, data-slot, CVA for variants)

## Test Strategy (MANDATORY)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | Detected | Vitest (126 tests, all pass) |
| E2E framework | Not configured | No Playwright/Cypress |
| Test DB | N/A | Pure client-side, no DB |
| Mock inventory | 0 | No mocks in codebase |

### AC → Test Mapping

| AC | Test Type | Test Intention |
|----|-----------|----------------|
| AC-1 | Manual | Page loads with correct default state |
| AC-2 | Manual | Tab switching swaps blocks |
| AC-3 | Unit | `brandScopeCss()` outputs correct CSS for brand primitives + light/dark semantic tokens |
| AC-4 | Unit | `neutralScopeCss()` outputs correct CSS for neutral primitives + light/dark semantic tokens |
| AC-5 | Manual | Tab switch preserves palette selection |
| AC-6 | Unit | Scoped CSS contains `:root:not(.dark)` and `.dark` blocks with different token values |
| AC-7 | Manual | Color dot previews visible in selectors |
| AC-E1 | Unit | `getPaletteById` fallback works; `brandScopeCss` handles valid shades |

### Failure Mode Tests (MANDATORY)

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E1 | Unit: fallback palette when ID invalid | BLOCKING |
| Failure Hypothesis | FH-1 | Unit: light-mode semantic tokens differ from dark-mode | BLOCKING |
| Failure Hypothesis | FH-2 | Unit: bridge tokens (--primary, --ring, etc.) included in output | BLOCKING |

### Mock Boundary

No external dependencies. All computation is pure (palette generation + CSS string building). No mocks needed.

### TDD Commitment

`palette-theme.ts` tests written BEFORE implementation. Block components are visual — verified manually against screenshots.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CSS var() chain doesn't cascade through inheritance | HIGH | HIGH | Emit ALL 3 layers (primitives + semantics + bridge) on scoped element. Bridge tokens (`--primary`, `--ring`, etc.) MUST be re-declared — they don't auto-resolve from `:root` |
| Radix Portal escapes scope wrapper | HIGH | HIGH | Block templates must NOT use Portal-based components (Select, DropdownMenu, Modal, Tooltip). Toolbar selectors live outside scope wrapper |
| Opacity tokens (`--root-opacity-brand-*`) are hardcoded hex, don't adapt to new palette | MED | HIGH | Recompute as `color-mix(in srgb, <hex> <alpha>%, transparent)` in emitted CSS |
| Semantic token mappings in JS drift from CSS source | MED | LOW | Static arrays mirror semantic-colors.css; add code comment linking to source |
| Block components don't match Pencil screenshots | MED | MED | Use exact values from screenshots; verify visually during implementation |
| CSS injection fails like previous iteration | HIGH | MED | Gate 1 validates injection before templates. If Gate 1 >1.5h → STOP and reassess |

**Kill criteria:** If scoped CSS approach fails in Gate 1 validation, switch to CSS-in-JS or iframe isolation.

## State Machine

```
[login_tab] ──click "Preferences"──▶ [preferences_tab]
[preferences_tab] ──click "Login"──▶ [login_tab]

State: { activeTab: string, brandId: string, neutralId: string }
brandId + neutralId live in URL search params (?brand=orange&neutral=stone)
activeTab is local state (not URL — tabs are ephemeral navigation)
Tab switch preserves palette selection via URL persistence.
```

## Analysis

### Assumptions Challenged

| Assumption | Evidence For | Evidence Against | Verdict |
|------------|-------------|-----------------|---------|
| CSS custom property var() chain cascades through inheritance | CSS spec says unregistered custom properties inherit specified values (with var() unresolved) | Previous iteration proved it doesn't work reliably in light mode — only primitives weren't enough | WRONG — must emit all 3 layers (primitives + semantics + bridge) on scoped element |
| Bridge tokens auto-resolve via inheritance when semantics are overridden | CSS custom properties cascade | `--primary` declared on `:root` resolves `var(--background-brand-strong-default)` at `:root` level. Overriding `--background-brand-strong-default` on a child does NOT retro-actively change `--primary`. Child must re-declare `--primary` explicitly | WRONG — bridge MUST be re-emitted |
| Tailwind palettes can be split into brand vs neutral | Tailwind has 5 gray-scale palettes (Slate/Gray/Zinc/Neutral/Stone) and 17 chromatic ones | Some palettes are borderline (e.g., very low chroma) | VALID — clear split by chroma; grays are explicitly named |
| Existing Lyse components respond to token overrides | Components use semantic tokens via CSS files, no hardcoded colors | Radix Portal-based components render outside scope. Tailwind utilities resolve through @theme inline | RISKY — bridge tokens + portal constraint required |
| 3h is realistic for a rebuild | Learnings baked in, clean spec | Previous attempt was built and reverted. Injection mechanism needs validation before templates | WRONG — revised to 5h with two-gate structure |

### Blind Spots

1. **[Technical]** The `@theme inline` block in globals.css adds another layer of indirection (`--color-primary: var(--primary)`). Bridge tokens cover this.
   Why it matters: Tailwind utilities like `bg-primary` resolve through `--color-primary`, not directly through `--primary`.

2. **[Technical]** Radix Portal escape — SelectContent, DropdownMenu, Tooltip use `Portal` which renders to `document.body`, outside `[data-blocks-scope]`. Block templates must NOT use Portal-based components.
   Why it matters: Most interactive elements in templates would silently ignore palette overrides.

3. **[Technical]** `--root-opacity-brand-*` tokens are hardcoded hex (e.g. `#2b7fff36`), not derived from primitives. Must recompute as `color-mix()` in emitted CSS.
   Why it matters: Focus rings, shadows, overlays would stay on original hue regardless of selected brand.

4. **[UX]** No loading state when switching palettes — CSS injection is synchronous via `useMemo` so this should be instant, but large style recalculations could cause a flash.
   Why it matters: Would feel janky if there's a visible delay.

### Failure Hypotheses

| IF | THEN | BECAUSE | Severity | Mitigation |
|----|------|---------|----------|------------|
| Bridge tokens not re-emitted on scope | `bg-primary`, `text-foreground`, `ring-ring` utilities stay on default brand — most visible Tailwind classes silently wrong | `--primary` declared on `:root`, child inherits already-resolved value | CRITICAL | Emit bridge tokens explicitly in scoped CSS |
| Template includes Portal-based component (Select, DropdownMenu) | Dropdown panels render with global theme, breaking theming illusion | Radix Portal teleports DOM to `document.body`, outside scope | HIGH | Templates must not use Portal components |
| Opacity tokens unchanged when brand switches | Focus rings, shadows, overlays remain original blue | `--root-opacity-brand-*` are hardcoded hex, not computed from primitives | MED | Recompute as `color-mix()` |
| Only primitive tokens are overridden on the scoped element | Light mode won't reflect palette changes | Semantic tokens on :root resolve var() at :root level, not at the child | HIGH | Emit semantic + bridge tokens alongside primitives |
| Neutral semantic tokens overlap with non-neutral tokens | Changing neutral palette breaks danger/success/warning colors | Some semantic tokens use neutral primitives for base/disabled states | MED | Only override tokens that reference `--root-color-neutral-*`, not all tokens |

### The Real Question

Confirmed — spec solves the right problem. Users need to SEE palettes in context to make decisions. A color grid isn't enough; realistic UI with brand + neutral separation is the right abstraction. The approach is architecturally sound with the three fixes applied (bridge re-emission, portal constraint, opacity recomputation).

### Open Items

- [improvement] Consider adding "Open in Generator" link from blocks page → no action (out of scope, easy to add later)
- [risk] Neutral token list is large (~50 tokens per mode) — verify completeness against semantic-colors.css → explore during implementation

## Notes

Previous iteration learnings:
- var() chain DOES NOT cascade reliably from primitives alone — must emit all 3 layers
- Bridge tokens (`--primary`, `--ring`, `--border`, etc.) MUST be re-declared on scope — they do NOT auto-resolve via inheritance from `:root`
- `[data-dark]` attribute approach for scoped dark mode was added to semantic-colors.css but then reverted; `.dark` class on html + scoped `:root:not(.dark)` / `.dark` selectors is the correct approach
- `useId()` generates IDs with colons (`:r0:`) — safe in CSS attribute selectors with quotes (`[data-blocks-scope=":r0:"]`)
- Radix Portal components escape scope — never use Select/DropdownMenu/Modal/Tooltip inside block templates
- `--root-opacity-brand-*` are hardcoded hex strings, not computed from primitives — must recompute for brand switching

Spec review applied: 2026-03-14

## Progress

### Gate 1 — CSS Injection Validation
| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | palette-theme.ts (TDD) | [x] | 1 — 27 tests GREEN |
| 2 | BRAND/NEUTRAL palette exports | [x] | 1 |
| 3 | Visual proof (light + dark) | [x] | 1 — validated via build |

### Gate 2 — Templates + Shell
| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 4 | auth-block.tsx | [x] | 1 |
| 5 | settings-block.tsx | [x] | 1 |
| 6 | blocks-toolbar.tsx | [x] | 1 |
| 7 | blocks-shell.tsx | [x] | 1 |
| 8 | app/blocks/page.tsx | [x] | 1 |
| 9 | Sidebar nav | [x] | 1 |
| 10 | Quality pass | [x] | 1 — lint (pre-existing only), typecheck clean, 126 tests pass, build clean |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-14T12:15:00 | - | Created (fresh start after full revert) |
| spec-review | 2026-03-14T13:00:00 | - | 4 perspectives (CSS Arch, React, UX, Skeptic). 3 blockers fixed: bridge re-emission, portal constraint, two-gate structure. Estimate revised 3h→5h. URL params added. Code pill removed. |
