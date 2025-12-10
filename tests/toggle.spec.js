const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

function getFileUrl(relativePath) {
  const fullPath = path.resolve(__dirname, '..', relativePath);
  let url = 'file://' + fullPath;
  url = url.replace(/\\/g, '/');
  return url;
}

test.describe('Toggle Switch – Handoff Blueprint', () => {

  test('should toggle between ON and OFF when clicked (MCP-driven)', async ({ page }) => {
    await page.goto(getFileUrl('src/index.html'));

    const toggle = page.locator('[data-role="toggle-switch"]');
    const stateText = page.locator('[data-role="toggle-state-text"]');

    await expect(toggle).toHaveAttribute('data-state', 'off');
    await expect(stateText).toHaveText('OFF');

    await toggle.click();
    await expect(toggle).toHaveAttribute('data-state', 'on');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await expect(stateText).toHaveText('ON');

    await toggle.click();
    await expect(toggle).toHaveAttribute('data-state', 'off');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(stateText).toHaveText('OFF');
  });

  test('MCP definition, tokens and CSS variables are aligned', async ({ page }) => {
    await page.goto(getFileUrl('src/index.html'));

    const mcpPath = path.resolve(__dirname, '..', 'design', 'figma-mcp-export.json');
    const tokensPath = path.resolve(__dirname, '..', 'design', 'tokens.json');

    const mcp = JSON.parse(fs.readFileSync(mcpPath, 'utf-8'));
    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

    expect(mcp.componentName).toBe('ToggleSwitch');
    expect(mcp.properties.state.values).toContain('off');
    expect(mcp.properties.state.values).toContain('on');
    expect(mcp.properties.state.default).toBe('off');

    const designTrackOffToken = mcp.tokens['track.off.background'];
    const designTrackOnToken = mcp.tokens['track.on.background'];
    const designThumbToken = mcp.tokens['thumb.background'];

    const resolveToken = (ref) => {
      const match = ref.match(/^\{(.+)\}$/);
      if (!match) return null;
      const pathParts = match[1].split('.');
      return pathParts.reduce((acc, key) => (acc ? acc[key] : undefined), tokens);
    };

    const resolvedTrackOff = resolveToken(designTrackOffToken);
    const resolvedTrackOn = resolveToken(designTrackOnToken);
    const resolvedThumb = resolveToken(designThumbToken);

    const expectedTrackOff = tokens.color.neutral['700'];
    const expectedTrackOn = tokens.color.green['500'];
    const expectedThumb = tokens.color.neutral['0'];

    expect(resolvedTrackOff).toBe(expectedTrackOff);
    expect(resolvedTrackOn).toBe(expectedTrackOn);
    expect(resolvedThumb).toBe(expectedThumb);

    const cssVars = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        trackOff: styles.getPropertyValue('--color-toggle-track-off').trim(),
        trackOn: styles.getPropertyValue('--color-toggle-track-on').trim(),
        thumb: styles.getPropertyValue('--color-toggle-thumb').trim()
      };
    });

    expect(cssVars.trackOff.toLowerCase()).toBe(expectedTrackOff.toLowerCase());
    expect(cssVars.trackOn.toLowerCase()).toBe(expectedTrackOn.toLowerCase());
    expect(cssVars.thumb.toLowerCase()).toBe(expectedThumb.toLowerCase());
  });

});
