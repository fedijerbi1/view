# Dashboard Design System - Implementation Guide

## 🎯 Mission
Create practical, implementation-ready guidance for engineers and designers to maintain consistency across the medical platform using a modern, dark-themed dashboard aesthetic inspired by Heroku/Vercel/GitHub.

---

## 📋 Table of Contents

1. [Visual Foundations](#visual-foundations)
2. [Design Tokens](#design-tokens)
3. [Component Library](#component-library)
4. [Accessibility Requirements](#accessibility-requirements)
5. [Responsive Behavior](#responsive-behavior)
6. [Usage Examples](#usage-examples)
7. [QA Checklist](#qa-checklist)

---

## 🎨 Visual Foundations

### Brand Identity
- **Visual Style**: Modern, clean, cloud-platform aesthetic
- **Theme**: Dark mode (primary), accessible light mode support
- **Philosophy**: Modular grids, glass-like panels, strong data hierarchy for productivity

### Color Palette

| Token | Value | Usage | WCAG AA |
|-------|-------|-------|---------|
| `--color-primary` | `#0c5cab` | Primary CTAs, active states, brand | ✅ |
| `--color-success` | `#10b981` | Positive status, confirmations | ✅ |
| `--color-warning` | `#f59e0b` | Cautions, medium priority alerts | ✅ |
| `--color-danger` | `#ef4444` | Errors, critical status | ✅ |
| `--color-text` | `#fafafa` | Primary text (near-white) | ✅ |
| `--color-text-mid` | `#a1a1a6` | Secondary text | ✅ |
| `--color-surface` | `#09090b` | Main background (near-black) | ✅ |
| `--color-border` | `#2d2d33` | Dividers and borders | ✅ |

**All color pairs meet WCAG AA contrast requirements (4.5:1 minimum).**

### Typography Scale

```
Display:    32px (h1) - Page titles
Large:      24px (h2) - Section titles  
Medium:     20px (h3) - Subheadings
Base:       16px (p)  - Body text
Small:      14px      - Labels, subtitles
XSmall:     12px      - Captions, tags
```

**Font Family**: IBM Plex Sans (primary), IBM Plex Mono (code)
**Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing Grid
**8px baseline grid** — all spacing must be multiples of 8:

```
--space-1: 4px      (0.5 unit)
--space-2: 8px      (1 unit)
--space-3: 12px     (1.5 units)
--space-4: 16px     (2 units)
--space-5: 20px     (2.5 units)
--space-6: 24px     (3 units)
--space-8: 32px     (4 units)
```

### Shadows & Depth
```css
--shadow-inset: inset 0 2px 4px rgba(0,0,0,.25), 
                inset 0 -2px 4px rgba(255,255,255,.05);
--shadow-card:  0 4px 12px rgba(0,0,0,.15), 
                0 2px 6px rgba(0,0,0,.1);
--shadow-modal: 0 12px 40px rgba(0,0,0,.25), 
                0 8px 20px rgba(0,0,0,.15);
--shadow-hover: 0 8px 24px rgba(0,0,0,.2), 
                0 4px 12px rgba(0,0,0,.12);
```

---

## 🎛️ Design Tokens

All values are defined in CSS custom properties (variables). Reference them directly:

```css
/* Color */
background: var(--color-surface);
color: var(--color-text);

/* Spacing */
padding: var(--space-4);
margin-bottom: var(--space-6);

/* Radius */
border-radius: var(--radius-md);

/* Shadows */
box-shadow: var(--shadow-card);

/* Transitions */
transition: all var(--transition-base);
```

---

## 🧩 Component Library

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">Action</button>
```
- Background: `--color-primary`
- Padding: `var(--space-2) var(--space-5)`
- Border radius: `var(--radius-md)`
- Min height: `var(--touch-target)` (44px)
- States: hover (elevated), active (settled), disabled (50% opacity)

#### Secondary Button
```html
<button class="btn btn-secondary">Action</button>
```
- Background: `--color-surface-alt`
- Border: `1px solid --color-border`
- Inset shadow for depth

#### Ghost Button
```html
<button class="btn btn-ghost">Action</button>
```
- Background: transparent
- Border: `1px solid --color-primary`

**State Rules:**
- ✅ **Hover**: `transform: translateY(-1px)`, elevated shadow
- ✅ **Active**: `transform: translateY(0)`, card shadow
- ✅ **Disabled**: `opacity: 0.5`, `cursor: not-allowed`
- ✅ **Focus**: Keyboard ring: `box-shadow: var(--shadow-focus)`

### Input Fields

```html
<input class="form-control" type="text" placeholder="Enter text...">
<textarea class="form-control" placeholder="Enter message..."></textarea>
<select class="form-control">
  <option>Option 1</option>
</select>
```

**Styling:**
- Min height: `var(--touch-target)` (44px)
- Padding: `var(--space-2) var(--space-3)`
- Background: `--color-surface`
- Box shadow: `var(--shadow-inset)` (focused state)
- Border radius: `var(--radius-md)`

**States:**
- ✅ **Default**: Inset shadow
- ✅ **Focus**: Box shadow + focus ring
- ✅ **Invalid** (`.is-invalid`): Red border, light red background
- ✅ **Valid** (`.is-valid`): Green border, light green background

### Cards & Panels

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

**Anatomy:**
```
┌─────────────────────────────┐
│  Padding: var(--space-6)    │
│  ┌───────────────────────┐  │
│  │ Card content          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
Background: --color-surface
Border: 1px solid --color-border
Border-radius: var(--radius-lg)
Box-shadow: var(--shadow-card)
```

**Variants:**
- `.card` — standard card with shadow
- `.panel` — alt surface color, no shadow
- `.card-alt` — secondary background

### Badges

```html
<span class="badge">Default</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Error</span>
```

**Properties:**
- Display: `inline-block`
- Padding: `var(--space-1) var(--space-3)`
- Border radius: `var(--radius-full)`
- Font size: `var(--font-size-xs)`
- Font weight: 600

### Progress Bars

```html
<div class="progress">
  <div class="progress-bar" style="width: 65%"></div>
</div>
```

**Behavior:**
- Height: 6px (for data viz), 8px (for visual impact)
- Border radius: `var(--radius-full)`
- Transition: `var(--transition-base)`
- Color: `--color-primary` (can use `.progress-bar-success`, `.progress-bar-warning`)

### Tables

```html
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

**Styling:**
- Header background: `--color-surface-alt`
- Header text: `--color-text-mid` (12px, uppercase)
- Body text: `--color-text` or `--color-text-mid`
- Borders: `1px solid --color-border`
- Hover row: Background `--color-surface-alt`
- Padding: `var(--space-2) var(--space-3)`

### Alerts & Notifications

```html
<div class="alert alert-success">✅ Success message</div>
<div class="alert alert-warning">⚠️ Warning message</div>
<div class="alert alert-danger">❌ Error message</div>
```

**Anatomy:**
```
┌─ Icon + Border
│  Background: Semantic color @ 10% opacity
│  Border: Semantic color (100%)
│  Padding: var(--space-3) var(--space-4)
│  Border-radius: var(--radius-md)
```

### Forms

```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="form-control" placeholder="user@example.com">
</div>
```

**Form Label:**
- Font size: `var(--font-size-xs)`
- Font weight: 600
- Text transform: uppercase
- Letter spacing: 0.05em
- Color: `--color-text-mid`

---

## ♿ Accessibility Requirements

### WCAG 2.2 AA Compliance

| Criterion | Implementation | Testing |
|-----------|---|---|
| **Contrast** | All text ≥ 4.5:1 (normal) or 3:1 (large) | Use WebAIM contrast checker |
| **Focus** | Visible focus ring on all interactive elements | `box-shadow: var(--shadow-focus)` |
| **Touch targets** | Min 44px × 44px | `min-height: var(--touch-target)` |
| **Keyboard nav** | Tab order correct, no keyboard traps | Test with keyboard only |
| **Semantic HTML** | Use `<button>`, `<input>`, `<label>`, roles | Avoid `<div role="button">` |
| **Screen readers** | Descriptive labels, ARIA where needed | Test with NVDA/JAWS |
| **Color alone** | Don't convey status/info by color only | Use icons, text + color |
| **Motion** | Respect `prefers-reduced-motion` | @media (prefers-reduced-motion: reduce) |

### Keyboard Navigation

- **Tab order**: Follow visual left-to-right, top-to-bottom
- **Focus visible**: Always show focus state (never `outline: none`)
- **Escape key**: Close modals, popovers
- **Enter/Space**: Activate buttons
- **Arrow keys**: Navigate within groups (radio, menu)

### Screen Reader Labels

```html
<!-- Good -->
<button aria-label="Close dialog">✕</button>

<!-- Bad -->
<button>✕</button>
```

### Motion & Animation

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Behavior

### Breakpoints
```css
xs:  0px      (mobile portrait)
sm:  640px    (tablet portrait)
md:  768px    (tablet landscape)
lg:  1024px   (desktop)
xl:  1280px   (large desktop)
```

### Mobile-First Strategy
1. Style for mobile (0px) by default
2. Add media queries for larger screens
3. Test on actual devices, not just browsers

### Grid Responsiveness

```css
/* Mobile: 1 column */
.grid { grid-template-columns: 1fr; }

/* Tablet (640px+): 2 columns */
@media (min-width: 640px) {
  .grid-2-sm { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop (1024px+): 4 columns */
@media (min-width: 1024px) {
  .grid-4-lg { grid-template-columns: repeat(4, 1fr); }
}
```

### Sidebar Responsiveness

On mobile (< 768px):
- Move sidebar off-screen (left: -240px)
- Add toggle button to show/hide
- Use overlay/backdrop when open

---

## 📝 Usage Examples

### Complete Form

```html
<form>
  <div class="form-group">
    <label class="form-label">Full Name</label>
    <input type="text" class="form-control" placeholder="John Doe" required>
  </div>
  
  <div class="form-group">
    <label class="form-label">Email</label>
    <input type="email" class="form-control" placeholder="john@example.com" required>
  </div>
  
  <div class="form-group">
    <label class="form-label">Message</label>
    <textarea class="form-control" rows="4" placeholder="Your message..."></textarea>
  </div>
  
  <button type="submit" class="btn btn-primary">Send Message</button>
</form>
```

### Patient Dashboard Card

```html
<div class="card">
  <h3>Heart Rate Monitor</h3>
  <div class="grid grid-2-sm" style="margin: var(--space-4) 0;">
    <div>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-mid);">Current</div>
      <div style="font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text);">72 bpm</div>
    </div>
    <div>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-mid);">Status</div>
      <span class="badge badge-success">Normal</span>
    </div>
  </div>
  
  <div class="progress">
    <div class="progress-bar" style="width: 72%"></div>
  </div>
  
  <p style="font-size: var(--font-size-xs); color: var(--color-text-light); margin-top: var(--space-3);">
    Last updated: 2 minutes ago
  </p>
</div>
```

### Data Table with Status

```html
<table>
  <thead>
    <tr>
      <th>Patient Name</th>
      <th>Last Visit</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>Jan 15, 2024</td>
      <td><span class="badge badge-success">Active</span></td>
      <td>
        <button class="btn btn-secondary">View</button>
      </td>
    </tr>
  </tbody>
</table>
```

---

## ✅ QA Checklist

Before merging any UI changes:

### Visual
- [ ] Colors match design tokens (use dev tools to inspect)
- [ ] Spacing follows 8px grid
- [ ] Shadows are consistent (inset/card/modal)
- [ ] Border radius follows scale
- [ ] Typography hierarchy maintained
- [ ] Dark mode theme applied globally

### Interaction
- [ ] Buttons respond to hover/active states
- [ ] Forms show valid/invalid states
- [ ] Loading states are visible (spinners, disabled state)
- [ ] Errors display with icons + descriptive text
- [ ] Success states use green badge/alert

### Accessibility
- [ ] All interactive elements keyboard-accessible (Tab)
- [ ] Focus ring visible on all buttons/inputs
- [ ] No keyboard traps
- [ ] Color not sole conveyor of information
- [ ] Images have alt text
- [ ] Form labels associated with inputs (`<label for="id">`)
- [ ] Screen reader test (read aloud in browser)

### Responsiveness
- [ ] Mobile (320px), Tablet (768px), Desktop (1024px) tested
- [ ] Grid collapses correctly at breakpoints
- [ ] Sidebar toggles on mobile
- [ ] Touch targets ≥ 44px
- [ ] Text readable without horizontal scroll

### Performance
- [ ] CSS is minified in production
- [ ] No unused CSS classes in output
- [ ] Shadow layering optimized (3-4 shadows max per element)
- [ ] Transitions use GPU acceleration (`transform`, `opacity`)

### Browser Support
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚀 Getting Started

### 1. Import Global Styles
```javascript
// App.js
import './styles/global.css';
import './styles/sidebar.css';
```

### 2. Use Design Tokens
```javascript
// In React components
<div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
  Content
</div>
```

### 3. Apply Classes
```html
<button class="btn btn-primary">Click me</button>
<input class="form-control" type="text">
<div class="card">Content</div>
```

### 4. Customize with Variables
```css
:root {
  --color-primary: #0c5cab; /* Brand blue */
  --color-danger: #ef4444;  /* Error red */
}
```

---

## 📚 Additional Resources

- **Figma**: [Design System Specs](https://figma.com/...)
- **Color Contrast**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Typography**: [Google Fonts - IBM Plex](https://fonts.google.com/specimen/IBM+Plex+Sans)
- **Accessibility**: [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
