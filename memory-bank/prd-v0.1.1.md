# PRD Patch v0.1.1 - Social Media Card Generator

## New visual requirements

| Change           | Detail                                                                              |
| :--------------- | :---------------------------------------------------------------------------------- |
| Background       | Solid white (#FFFFFF)                                                               |
| Brand color (text) | Keep the hack-pop red (#FF2A2A) for all headings & body text                        |
| Permanent tag    | `ai-hackathon.co` — locked to the bottom-left corner, red text, 24 px |
| Additional Tag   | `#LATAMACELERA` — locked to the bottom-right corner, red text, 24 px |

## 1 · Updated Functional Requirements (delta)

- **F1-a:** `CardCanvas` must reserve a 40 px × full-width strip at the bottom for the permanent tags safe area.
- **F1-b:** The bottom tags are not editable and auto-render `ai-hackathon.co` (left) and `#LATAMACELERA` (right).
- **F2 (rendering):** Switch canvas base color to white; keep text color constants. Introduce a new theme `latamWhite`.
- **F3 (exports):** Maintain same PNG sizes (X, LinkedIn, IG) but ensure both bottom tags remain visible after cropping / aspect-ratio scaling. Export logic uses `scaleAndCrop` (center-crop "cover" behavior) on the 1600x900 base image. The bottom 40px tag bar is inherently preserved. Exported images always use the desktop headline font size (96px).

## 2 · Revised Canvas Layout

```css
┌───────────────────────────1600px────────────────────────────┐
│ (Team name - top-left)                                      │
│                                                             │
│                                                             │
│  BIG IDEA HEADLINE                                          │
│  (auto-wrapped)                                             │
│                                                             │
│  Looking for: roles                                         │
│                                                             │
├──────────────────────────────────────────────────────────────┤ ← 40 px high
│ ai-hackathon.co                             #LATAMACELERA │
└──────────────────────────────────────────────────────────────┘
```

- **Padding guidelines:** 120 px safe area left/right/top for all networks; bottom tag bar sits inside its own 40 px bottom gutter. Tags use 120px left/right padding respectively.
- **Typography:** (Using 'Inter' font family)
    - Team name = 20 px bold, top-left.
    - Headline = 96 px (desktop/export) / 72 px (mobile preview), weight 700.
    - “Looking for” = 48 px.
    - Bottom Tags (`ai-hackathon.co`, `#LATAMACELERA`) = 24 px absolute, weight 600.

## 3 · `CardCanvas` Component Spec (revised)

| Prop       | Type                  | Purpose                 |
| :--------- | :-------------------- | :---------------------- |
| theme      | string | default "default" | selects palette via `THEMES` map. New: "latamWhite" |
| teamName   | string                | rendered top-left.      |
| idea       | string                | main headline.          |
| lookingFor | string                | roles line.             |
| fontSizes? | `{ headline: number, lookingFor: number }` | Optional font sizes (used by preview wrapper for mobile scaling). Defaults internally if not provided. |

**Theme Handling**

A new theme `latamWhite` should be added to the existing `THEMES` map. The default theme remains unchanged.

```ts
// Example structure (adapt to actual file)
export const THEMES = {
  default: { bg: '#000000', text: '#FF2A2A' },
  latamWhite: { bg: '#FFFFFF', text: '#FF2A2A' }   // NEW
} as const;

// CardCanvas usage:
// const {bg, text} = THEMES[theme] ?? THEMES.default;
```

**Font Handling**

- **Preferred Font:** 'Inter'. Load via Google Fonts (recommended) or self-hosted.
- **Fallback:** System UI stack (`font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;`).
- **Canvas Rendering:** Ensure the 'Inter' font is loaded before rendering the canvas (e.g., use `document.fonts.ready` if using `html2canvas`). Specify font explicitly in canvas context: `ctx.font = '700 96px Inter';`, `ctx.font = '600 16px Inter';`, etc.

**Internal constants**

```ts
const BG_COLOR = '#FFFFFF'; // For latamWhite theme
const TEXT_COLOR = '#FF2A2A'; // For latamWhite theme
const BOTTOM_TAG_TEXT_LEFT = 'ai-hackathon.co';
const BOTTOM_TAG_TEXT_RIGHT = '#LATAMACELERA';
const BOTTOM_TAG_HEIGHT = 40; // px on 1600×900; scale proportionally
const BASE_WIDTH = 1600;
const BASE_HEIGHT = 900;
const SAFE_PADDING = 120;
```

**Canvas build order:**

1.  Fill background (`THEMES[theme].bg`).
2.  Draw team name (align left, x = 120 px, y = 120 px, color=`THEMES[theme].text`, font=20px bold Inter).
3.  Draw idea text block (auto-fit inside width-120 padding, start y = 240 px, color=`THEMES[theme].text`, font= `fontSizes.headline` or 96px, weight 700 Inter).
4.  Draw lookingFor line (y = ideaBlockBottom+80, color=`THEMES[theme].text`, font=`fontSizes.lookingFor` or 48px Inter).
5.  Calculate bottom tag Y position: `const safeBottom = BASE_HEIGHT - BOTTOM_TAG_HEIGHT; const tagY = safeBottom + (BOTTOM_TAG_HEIGHT / 2); // Center vertically`
6.  Draw red `ai-hackathon.co` text at (x = SAFE_PADDING, y = `tagY`, color='#FF2A2A', font=24px, weight 600 Inter, align left, baseline middle).
7.  Draw red `#LATAMACELERA` text at (x = BASE_WIDTH - SAFE_PADDING, y = `tagY`, color='#FF2A2A', font=24px, weight 600 Inter, align right, baseline middle).

## 4 · QA Checklist Additions

- [ ] ✅ Both bottom tags (`ai-hackathon.co`, `#LATAMACELERA`) visible in every export size, never cropped.
- [ ] ✅ Contrast ratio red (#FF2A2A) on white ≥ 4.0.
- [ ] ✅ No other text overlaps the 40 px bottom tag bar.
- [ ] ✅ 'Inter' font loads correctly and is used for all text elements on the canvas. Fallback font used if 'Inter' fails.

## 5 · Next Steps for Dev

- Update `theme.ts` (or equivalent) with the `latamWhite` theme definition.
- Implement 'Inter' font loading (e.g., add Google Fonts link to HTML head) and ensure canvas rendering waits for font readiness.
- Update `CardCanvas` constants (`BOTTOM_TAG_TEXT_LEFT`, `BOTTOM_TAG_TEXT_RIGHT`) and drawing logic for:
    - Team name position (top-left).
    - Bottom tags rendering (left and right aligned).
- Adjust auto-fit algorithm to respect the `BOTTOM_TAG_HEIGHT` bottom safe area (if text could previously flow into this area).
- Pass dynamic `fontSizes` from the preview wrapper for mobile headline adjustment (if not already done).
- Regression test for 80-char idea & long team names.
- Replace marketing screenshots in README / landing page to reflect white-theme. 