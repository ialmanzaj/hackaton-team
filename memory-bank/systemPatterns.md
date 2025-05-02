# System Patterns

*   **Component:** `CardCanvas` - A core component responsible for rendering the social media card onto an HTML canvas based on input props.
*   **Rendering Engine:** Likely uses the HTML Canvas 2D API directly or via a library like `html2canvas`.
*   **Styling:** Theme-based styling managed via a TypeScript constant map (`THEMES`).
*   **Image Export:** Uses a `scaleAndCrop` function (likely implementing center-crop/cover behavior) to generate different PNG sizes from the base canvas render.
*   **Frontend Framework:** Assumed to be React (based on `useMediaQuery`, `tsx` examples). 