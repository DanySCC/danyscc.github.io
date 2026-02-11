# KOL Clickable Card Example

## Visual Behavior

When hovering over a KOL discussion card:
- Entire card is clickable (not just a button)
- Background shifts from `var(--card)` to `var(--card-hover)`
- Border color changes to `var(--accent-kol)` (Twitter blue)
- Card slides slightly right (`transform: translateX(3px)`)
- Arrow indicator `→` fades in on the right side
- Cursor changes to pointer

## HTML Structure

```html
<a href="https://x.com/cz_binance/status/1887654321098765432" class="kol-card" target="_blank">
    <div class="kol-header">
        <div class="kol-avatar" style="background: linear-gradient(135deg, #f7931a, #f59e0b)">CZ</div>
        <div class="kol-info">
            <div class="kol-name">CZ <span class="kol-badge badge-market">Market</span></div>
            <div class="kol-handle">@cz_binance</div>
        </div>
        <span class="kol-time">3 hours ago</span>
    </div>
    <p class="kol-text">Discusses new regulatory framework for crypto exchanges in Asia and implications for global markets.</p>
</a>
```

## Key Features

✅ **Entire card clickable** - Wraps content in `<a>` tag
✅ **Opens in new tab** - `target="_blank"` attribute
✅ **Hover effect** - Visual feedback with color and movement
✅ **Arrow indicator** - `→` appears on hover (via CSS ::after)
✅ **Clean design** - Minimal, matches existing news cards
✅ **Tweet URL required** - Links directly to X.com post

## CSS Styling

- `.kol-card` now has `display: block` and `cursor: pointer`
- Hover effect: `transform: translateX(3px)` and border color change
- Arrow `→` added via `::after` pseudo-element
- Arrow fades in on hover with opacity transition

## Mobile Responsive

Works on all screen sizes - touch devices can tap the entire card area.
