# Micro-Frameworks for Squarespace HTML+JS Fragments

## Context
- Front-end is an HTML+JavaScript fragment added to a Squarespace code block.
- UI complexity is increasing (history components, interactive forms, etc).

## Recommended Micro-Frameworks

### 1. Alpine.js
- **Best for:** Small interactive components, progressive enhancement.
- **Why:** Lightweight (~10kB), no build tools, direct HTML usage, easy learning curve.
- **How:** `<script src="...">` tag, use `x-data`, `x-on`, etc. in HTML.
- **Drawbacks:** Not for large-scale state management or complex routing.

### 2. Petite Vue
- **Best for:** Vue-like reactivity in small fragments, no build step.
- **Why:** Tiny (~6kB), Vue syntax, direct HTML usage.
- **How:** `<script src="...">`, use `v-model`, `v-if`, etc. in HTML.
- **Drawbacks:** Limited to simple components.

### 3. htm/preact
- **Best for:** More complex UI, JSX-like syntax, small footprint.
- **Why:** Preact is a lightweight React alternative; htm allows JSX-like templates without a build step.
- **How:** Add scripts, write components in JS.
- **Drawbacks:** Slightly more setup, but feasible for code blocks.

### Not Recommended
- **React, Vue, Svelte:** Require build tools, larger bundles, may not work well in Squarespace code blocks without extra setup.

## Decision Guidance
- For minimal setup and direct HTML/JS editing: **Alpine.js** or **Petite Vue**.
- For more structure and logic: **Preact + htm**.

## Example (Alpine.js)
```html
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle History</button>
  <div x-show="open">
    <!-- History UI here -->
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

## Summary
- **Alpine.js**: Simple, robust, no build required.
- **Petite Vue**: Great for Vue syntax.
- **Preact/htm**: For more structure.

---
Let me know if you want a starter template or integration example for any of these frameworks.
