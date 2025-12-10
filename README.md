# Handoff Blueprint 2025 – ToggleSwitch (Design → Dev → QA)

![Playwright](https://img.shields.io/badge/Playwright-Tested-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

A small but complete example of how a single component can be wired from **Design → Dev → QA** using:

- Figma Variables / MCP-style definition
- JSON contracts (`design/*.json`)
- Design tokens → generated CSS variables
- Runtime behaviour driven by MCP
- Playwright tests that prove alignment

Perfect for:
- Design × Engineering × QA portfolios
- Handoff best-practice discussions
- Demoing modern front-end workflows

---

## 🧩 Project Structure

```txt
design/
  tokens.json               # Source-of-truth design tokens
  figma-mcp-export.json     # MCP-style component contract

scripts/
  generate-tokens-css.js    # Converts tokens.json → src/styles/tokens.css

src/
  index.html                # Demo page embedding MCP JSON
  styles/
    tokens.css              # Generated CSS variables
    toggle.css              # Component styling using tokens
  components/
    toggle.js               # MCP-driven behaviour (states / disabled)

tests/
  toggle.spec.js            # Playwright tests (behaviour + contract alignment)

docs/
  blueprint.md              # Design → Dev → QA explanation

.github/
  workflows/ci.yml          # CI pipeline (Node + Playwright)
```

---

## 🚀 Getting started

```bash
npm install
npx playwright install --with-deps
npm test
```

`npm test` will:

1. Regenerate `src/styles/tokens.css` from `design/tokens.json`
2. Run the Playwright tests

To view the HTML report:

```bash
npx playwright show-report
```

---

## 🎨 Figma Setup (high level)

You can mirror this setup in Figma using **Variables**:

1. Create a collection: `Design Tokens (2025)`
2. Add color variables:
   - `color.neutral.0`   → `#FFFFFF`
   - `color.neutral.700` → `#2A2A2A`
   - `color.neutral.900` → `#141414`
   - `color.green.300`   → `#6EE7B7`
   - `color.green.500`   → `#10B981`
3. Build a `ToggleSwitch` component with properties:
   - `state`: `off | on | disabled`
   - `size`: `sm | md | lg`
4. Use these variables for track and thumb fills.

These map directly to `design/tokens.json` and then to CSS variables used in `toggle.css`.

For a detailed walkthrough, see [`docs/blueprint.md`](docs/blueprint.md).

---

## 📜 MCP-style Contract

The MCP-style description of the component is in:

- `design/figma-mcp-export.json`

It defines:

- allowed properties and values (size, state)
- default values
- which tokens to use for which visual roles
- behaviour rules (e.g. `disabled: "noInteraction"`)

Both dev and QA rely on this file as a shared contract.

---

## 🎛 Implementation (Dev)

Key ideas in `src/components/toggle.js`:

- Reads MCP JSON from `<script id="mcp-config">` in `index.html`
- Uses MCP to determine:
  - allowed states (`off`, `on`, `disabled`)
  - default state (`off`)
  - whether `disabled` blocks interaction
- Updates ARIA attributes (`role="switch"`, `aria-checked`, `aria-disabled`)
- Renders the visual state via `data-state` attributes mapped to CSS

Styles in `src/components/toggle.css` only reference CSS variables, never raw hex codes.

---

## 🧪 Tests (QA)

`tests/toggle.spec.js` contains two tests:

1. **Behaviour (MCP-driven)**  
   Toggles through `OFF → ON → OFF` and asserts both DOM attributes and visible state text.

2. **MCP, tokens and CSS alignment**  
   - Reads `design/figma-mcp-export.json` and `design/tokens.json`
   - Resolves token references like `{color.green.500}`
   - Asserts they equal the expected token values
   - Reads `:root` CSS variables and checks they match token values at runtime

This way QA can prove that **Design → Tokens → CSS → Component** are all in sync.

---

## 🧩 Suggested GitHub Topics

You can tag the repo with:

`design-system` · `figma` · `tokens` · `playwright` · `qa-automation` · `handoff` · `frontend` · `mcp`

---

## 🤝 Contributing

PRs are welcome.

Before submitting:

```bash
npm install
npm test
```

If you extend this blueprint with more components or a richer MCP schema, feel free to fork and adapt.
