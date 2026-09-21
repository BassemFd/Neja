# 0001 — Style Dictionary as the token pipeline

Status: accepted · 2026-09-21

## Context

Neja's colors, radii and shell identity lived as a hand-written `:root` block in
`src/tokens/tokens.css`. That block was already a *derived* artifact — its
`--color-*` defaults are `resolvePalette(155)` copied in by hand as the
pre-hydration fallback — but nothing enforced that the copy stayed in sync, and
the values existed for the web only. We wanted:

- a single source of truth for tokens, in a portable format;
- the same tokens emitted for more than one platform, to demonstrate that a
  design system's tokens are platform-agnostic;
- the palette guardrail (no hex outside Wada's 159) extended to cover the token
  sources and every generated output, not just component code.

## Decision

Adopt **Style Dictionary 5** (latest stable; native DTCG `$value`/`$type`, ESM
config) as the build-time token pipeline.

- **Sources** in `tokens/` (DTCG JSON):
  - `primitives/wada-colors.json` — the 159 Wada colors, **generated** from
    `src/data/wada-colors.json`, never hand-copied.
  - `semantic/shell.json` — the fixed site chrome, **hand-authored**, each role a
    reference to a primitive (`{color.wada.deep-indigo}`).
  - `semantic/canvas.json` — the default component canvas (combo 155),
    **generated from `resolvePalette(155)`** and emitted as references to
    primitives.
  - `radius.json` — hand-authored dimensions.
- **Four platforms**: `web` (CSS custom properties → `src/tokens/tokens.css`,
  the file the app consumes), `ts` (typed constants, a build artifact),
  `ios` (Swift) and `android` (XML) into `build/tokens/` as a parity demo not
  consumed by the app.
- The `color.wada.*` primitives are **reference-only** — filtered out of every
  output so `:root` stays exactly `--shell-*`, `--color-*`, `--radius-*`.

## Build-time vs runtime — how they coexist

Style Dictionary owns **static** tokens and the **default** theme. Live
re-theming stays entirely with `resolvePalette()` / `PaletteProvider`, which
rewrite the `--color-*` variables at runtime for any Wada combination.

The seam is the default canvas. Rather than hand-maintain those 10 values (and
risk them drifting from the algorithm), we **generate them from the same
`resolvePalette(155)`** the runtime uses. One function feeds both paths, so
build-time and runtime cannot disagree. A Vitest test re-asserts it against the
committed CSS, and `tokens:check` fails CI if the committed generated files are
stale.

## Alternatives considered

- **Hand-author `canvas.json`** to match `resolvePalette(155)`, guarded only by
  the test. Rejected: freezes an algorithm's output as if it were design intent
  and duplicates logic the repo already owns.
- **Theo / Tokens Studio / a bespoke script.** Rejected: Style Dictionary is the
  de-facto standard, speaks DTCG natively, and gives the multi-platform outputs
  for free — a bespoke script would reimplement its transforms.
- **Keep the hand-written CSS.** Rejected: no single source, no other platforms,
  and the sync between the default canvas and the algorithm stayed unchecked.

## Consequences / trade-offs

- `src/tokens/tokens.css` and `src/tokens/tokens.generated.ts` are now
  **generated and committed**. Editing them by hand is wrong; a header says so
  and `tokens:check` enforces it.
- `build:tokens` runs before `dev` and `build`, a small added step.
- iOS/Android outputs are a demonstration, not wired into any app — deliberate
  scope, noted so nobody wires them expecting a consumer.
- The `@theme` block and `prefers-reduced-motion` are not tokens; they moved to
  the hand-authored `src/tokens/theme.css`.
