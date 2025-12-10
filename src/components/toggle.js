function loadMcpConfig() {
  const el = document.getElementById('mcp-config');
  if (!el) return null;
  try {
    const config = JSON.parse(el.textContent);
    // Validate MCP config structure to prevent malicious data
    if (!config || typeof config !== 'object') {
      console.warn('Invalid MCP config: must be an object');
      return null;
    }
    return config;
  } catch (e) {
    console.warn('Failed to parse MCP config', e);
    return null;
  }
}

function setupToggleSwitch(root) {
  const mcp = loadMcpConfig();
  const toggle = root.querySelector('[data-role="toggle-switch"]');
  const stateLabel = root.querySelector('[data-role="toggle-state-text"]');

  // Validate and sanitize allowed states to prevent injection
  let allowedStates = ['off', 'on', 'disabled'];
  if (mcp?.properties?.state?.values && Array.isArray(mcp.properties.state.values)) {
    allowedStates = mcp.properties.state.values.filter(
      val => typeof val === 'string' && /^[a-z_]+$/.test(val)
    );
    if (allowedStates.length === 0) {
      allowedStates = ['off', 'on', 'disabled'];
    }
  }
  
  // Validate default state
  let defaultState = 'off';
  if (mcp?.properties?.state?.default && typeof mcp.properties.state.default === 'string') {
    defaultState = allowedStates.includes(mcp.properties.state.default) 
      ? mcp.properties.state.default 
      : 'off';
  }

  function isDisabledState(state) {
    if (mcp?.behaviours?.disabled === 'noInteraction') {
      return state === 'disabled';
    }
    return false;
  }

  function renderState(state) {
    // Sanitize state input to prevent XSS
    if (typeof state !== 'string') {
      state = defaultState;
    }
    
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
      // Use textContent (not innerHTML) to prevent XSS, and ensure state is a safe string
      stateLabel.textContent = String(state).toUpperCase();
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
