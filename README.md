# ToggleSwitch — Design → Dev → QA

![Playwright](https://img.shields.io/badge/Playwright-Tested-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

A minimal but complete example showing how a single UI component can stay aligned across Design, Engineering, and QA using:

- Figma Variables / MCP-style structured definitions  
- JSON component contracts (`design/*.json`)  
- Design tokens → generated CSS variables  
- Runtime behaviour driven by MCP  
- Playwright tests proving contract alignment end-to-end  

This project demonstrates how one source of truth can drive design intent, implementation, and test logic.

---

## Project Structure

```
design/
  tokens.json               # Source-of-truth design tokens
  figma-mcp-export.json     # MCP-style component contract

scripts/
  generate-tokens-css.js    # tokens.json → src/styles/tokens.css

src/
  index.html                # Demo page embedding MCP JSON
  styles/
    tokens.css              # Generated CSS variables
    toggle.css              # Component UI referencing tokens only
  components/
    toggle.js               # MCP-driven behavior (states, disabled)

tests/
  toggle.spec.js            # Playwright tests verifying behavior + alignment

docs/
  blueprint.md              # Design → Dev → QA walkthrough

.github/
  workflows/ci.yml          # Node + Playwright CI pipeline
```

---

## Getting Started

```
npm install
npx playwright install --with-deps
npm test
```

`npm test` will:

1. Regenerate `src/styles/tokens.css`
2. Run all Playwright tests

To open the HTML report:

```
npx playwright show-report
```

---

## Figma Setup (Overview)

To mirror this repo inside Figma:

1. Create a collection: `Design Tokens (2025)`
2. Add color variables:  
   - `color.neutral.0` → `#FFFFFF`  
   - `color.neutral.700` → `#2A2A2A`  
   - `color.neutral.900` → `#141414`  
   - `color.green.300` → `#6EE7B7`  
   - `color.green.500` → `#10B981`
3. Create a `ToggleSwitch` component with:  
   - `state: off | on | disabled`  
   - `size: sm | md | lg`
4. Apply variables for all fills and styles.

These map directly into `design/tokens.json` → CSS variables → component logic.

For a detailed blueprint, see: `docs/blueprint.md`.

---

## MCP Component Contract

`design/figma-mcp-export.json` defines:

- Allowed component properties and values  
- Default state configuration  
- Token references for each visual role  
- Behaviour rules (e.g., `disabled: "noInteraction"`)  

Development and QA consume this file as a shared contract to prevent drift.

---

## Implementation

`src/components/toggle.js`:

- Reads MCP config from `<script id="mcp-config">`  
- Applies allowed states and default values  
- Updates ARIA attributes (`role="switch"`, `aria-checked`, `aria-disabled`)  
- Drives visuals using `data-state` attributes  
- Uses only CSS variables for styling (no hard-coded hex values)

---

## Tests

`tests/toggle.spec.js` includes:

### 1. Behaviour Test
- Toggles `off → on → off`  
- Asserts DOM attributes, accessible state, and visible text

### 2. Contract → Tokens → CSS Alignment Test
- Reads `figma-mcp-export.json` and `tokens.json`  
- Resolves token references (`{color.green.500}` → hex)  
- Checks that `:root` CSS variables match token values at runtime  

This validates alignment across the full chain:
**Design → Tokens → CSS → Component → Tests**.

---

## Suggested GitHub Topics

`design-system` · `figma` · `mcp` · `tokens` · `qa-automation` · `playwright` · `handoff` · `frontend`

---

## Author

**Vlad Babayan**  
Design-Driven Quality Engineering · GenAI Automation · Product Workflows  
LinkedIn: https://www.linkedin.com/in/vladbabayan  
Portfolio: https://vlad.figma.site

---

## Contributing

PRs are welcome.

```
npm install
npm test
```
