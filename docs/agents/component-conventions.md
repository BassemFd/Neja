# Component conventions

- One component per file in `src/components/ComponentName.tsx`, default export the component, named exports for variant types/props.
- Variants via `class-variance-authority` (`cva`), not hand-rolled className switch statements — keeps the variant matrix introspectable (`doc-writer` reads the `cva` config to generate the props table and example grid).
- Every component ships with a `ComponentName.meta.ts` alongside it: a small object describing its variants/props/default example, which `doc-writer` consumes to build the style-guide page and the copy-pasteable code panel. This is the concrete artifact `component-builder` hands off — not prose describing the component.
- Colors only via the semantic CSS-var tokens (`docs/agents/token-conventions.md`) — never a literal hex or a raw Tailwind color utility.
- Every interactive component needs, at minimum: a default state, a hover/focus-visible state, a disabled state. `visual-reviewer` checks for this explicitly.
- No component reaches into another component's internals or props beyond its public API — composition happens through props and children, not shared mutable state.
