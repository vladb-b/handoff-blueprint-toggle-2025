function loadMcpConfig() {
  const el = document.getElementById('mcp-config');
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch (e) {
    console.warn('Failed to parse MCP config', e);
    return null;
  }
}

function setupToggleSwitch(root) {
  const mcp = loadMcpConfig();
  const toggle = root.querySelector('[data-role="toggle-switch"]');
  const stateLabel = root.querySelector('[data-role="toggle-state-text"]');

  const allowedStates = mcp?.properties?.state?.values || ['off', 'on', 'disabled'];
  const defaultState = mcp?.properties?.state?.default || 'off';

  function isDisabledState(state) {
    if (mcp?.behaviours?.disabled === 'noInteraction') {
      return state === 'disabled';
    }
    return false;
  }

  function renderState(state) {
    if (!allowedStates.includes(state)) {
      state = defaultState;
    }

    toggle.setAttribute('data-state', state);
    toggle.setAttribute('aria-checked', state === 'on' ? 'true' : 'false');

    if (isDisabledState(state)) {
      toggle.setAttribute('aria-disabled', 'true');
    } else {
      toggle.removeAttribute('aria-disabled');
    }

    if (stateLabel) {
      stateLabel.textContent = state.toUpperCase();
    }
  }

  function getNextState(current) {
    if (isDisabledState(current)) return current;
    if (current === 'on') return 'off';
    return 'on';
  }

  toggle.addEventListener('click', (event) => {
    const currentState = toggle.getAttribute('data-state') || defaultState;
    const next = getNextState(currentState);
    renderState(next);
  });

  toggle.addEventListener('keydown', (event) => {
    const currentState = toggle.getAttribute('data-state') || defaultState;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const next = getNextState(currentState);
      renderState(next);
    }
  });

  const initialState = toggle.getAttribute('data-state') || defaultState;
  renderState(initialState);
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-toggle-root="demo"]');
  if (root) setupToggleSwitch(root);
});
