# Token naming conventions

Semantic roles only — never a raw color name, never a literal hex, anywhere outside `src/lib/palette.ts` and the generated `src/tokens/tokens.css`.

## Where tokens come from

Tokens are built by Style Dictionary from DTCG sources in `tokens/` — see `docs/adr/0001-style-dictionary.md`. Three layers:

- **Primitives** (`tokens/primitives/wada-colors.json`, `color.wada.<kebab>`) — the 159 Wada colors, **generated** from `src/data/wada-colors.json`. Never edit by hand.
- **Semantic** (`tokens/semantic/*.json`) — `shell.*` (hand-authored fixed chrome) and the default `color.*` canvas (**generated** from `resolvePalette(155)`). Every semantic value is a **reference** to a primitive (`{color.wada.jasper-red}`) — never an inline hex.
- **Radius** (`tokens/radius.json`) — hand-authored dimensions.

`src/tokens/tokens.css` (the `--shell-*`/`--color-*`/`--radius-*` you consume) and `src/tokens/tokens.generated.ts` are **generated** — run `npm run build:tokens`, don't edit them. The hand-written `@theme`/reduced-motion live in `src/tokens/theme.css`. Runtime re-theming is unchanged (`resolvePalette()`/`PaletteProvider`).

## Roles (`TokenRole` in `src/lib/palette.ts`)

| Token | CSS var | Use for |
|---|---|---|
| `background` | `--color-background` | Page/app background |
| `surface` | `--color-surface` | Cards, panels, anything raised above the background |
| `text` | `--color-text` | Primary text |
| `textMuted` | `--color-text-muted` | Secondary/caption text |
| `primary` | `--color-primary` | Primary action fill (main CTA buttons) |
| `primaryForeground` | `--color-primary-foreground` | Text/icon on top of `primary` |
| `secondary` | `--color-secondary` | Secondary action fill |
| `secondaryForeground` | `--color-secondary-foreground` | Text/icon on top of `secondary` |
| `accent` | `--color-accent` | Highlights, badges, focus rings |
| `border` | `--color-border` | Dividers, input borders, card outlines |

## Rules

- Components consume these via Tailwind arbitrary-value utilities against the CSS vars (`bg-[var(--color-primary)]`) or via the `cva` variant definitions in `src/components` — never a literal Tailwind color class (`bg-red-500`) and never an inline hex.
- Re-theming is a `:root` CSS-variable rewrite (see the palette switcher in `src/components/PaletteSwitcher.tsx` once built) — a component should never need code changes to look right under a new Wada combination.
- If a component needs a color role that doesn't exist yet in this table, that's a real gap — add the role to `TokenRole` and to `resolvePalette()`'s mapping logic, don't smuggle in a one-off hardcoded value.
