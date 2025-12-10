# Handoff Blueprint 2025 – ToggleSwitch

This document explains how a single ToggleSwitch component is wired end-to-end across Design, Dev and QA.

## 1. Design (Figma)

In Figma:

- Create a Variables collection: **Design Tokens (2025)**
- Define:
  - `color.neutral.0`   → #FFFFFF
  - `color.neutral.700` → #2A2A2A
  - `color.neutral.900` → #141414
  - `color.green.300`   → #6EE7B7
  - `color.green.500`   → #10B981
- Build a `ToggleSwitch` component with:
  - `state`: off, on, disabled
  - `size`: sm, md, lg
- Use the color variables for track and thumb fills.

## 2. MCP-style Definition

The Figma component is represented in code by:

- `design/figma-mcp-export.json`

This file describes:

- allowed properties and values
- default values
- which tokens should be used for which visual roles
- basic behaviour rules

## 3. Tokens → CSS

Design tokens are stored in:

- `design/tokens.json`

They are converted into runtime CSS variables via:

- `scripts/generate-tokens-css.js`

which generates:

- `src/styles/tokens.css`

The UI styles in `src/components/toggle.css` only refer to CSS variables, never raw hex values.

## 4. Implementation (Dev)

`src/components/toggle.js`:

- reads the MCP JSON embedded in `src/index.html`
- determines allowed states and the default state
- respects the `disabled: "noInteraction"` rule
- updates ARIA attributes (`role="switch"`, `aria-checked`, `aria-disabled`)

This means behaviour is configuration-driven instead of hardcoded.

## 5. QA (Playwright)

`tests/toggle.spec.js` contains two tests:

1. **Behaviour (MCP-driven)**  
   Ensures the toggle moves between `OFF` and `ON` correctly and updates ARIA attributes.

2. **MCP, tokens and CSS alignment**  
   - Reads MCP JSON and tokens JSON
   - Resolves MCP token references like `{color.neutral.700}`
   - Asserts they match token values
   - Asserts CSS variables on `:root` match those values at runtime

This closes the loop between **Design → Dev → QA**.

## 6. Why this matters

Instead of passing around static screenshots, this blueprint shows:

- a design-friendly way to specify components
- a dev-friendly way to consume that specification
- a QA-friendly way to validate the alignment automatically

All with a single small component.
