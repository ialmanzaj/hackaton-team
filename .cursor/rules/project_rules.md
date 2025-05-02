# Project Rules & Patterns

*   **Theme Handling:** Themes are managed via a central `THEMES` constant map. `CardCanvas` looks up theme colors (`bg`, `text`) using a `theme` string prop, falling back to `default` if the provided theme doesn't exist.
*   **Canvas Rendering:** Rendering uses absolute pixel values within the Canvas API. Font details (weight, size, family) must be explicitly set on the context (`ctx.font`).
*   **Font Loading:** Custom fonts (like 'Inter') loaded externally (e.g., Google Fonts) require synchronization. Canvas rendering must wait until the font is ready (`document.fonts.ready`) to prevent rendering issues.
*   **Responsive Preview:** Font size adjustments for different preview sizes (mobile vs. desktop) are handled in the wrapper React component, passing dynamic `fontSizes` props to `CardCanvas`. Exports *always* use desktop font sizes.
*   **Export Cropping:** Image exports use a center-crop "cover" strategy (`scaleAndCrop`). Content within safe areas (like the planned 40px bottom hashtag bar) should be preserved automatically if part of the base 1600x900 render. 