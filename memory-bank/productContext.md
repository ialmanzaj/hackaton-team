# Product Context: Social Media Card Generator v0.1.1

**Problem:** The previous design needs updating to align with new branding guidelines (LATAM ACELERA campaign).

**Solution:** Modify the social media card generator to adopt a new visual theme: solid white background (#FFFFFF) with the existing hack-pop red text (#FF2A2A). Introduce a non-editable, permanent "#LATAMACELERA" hashtag at the bottom, ensuring it remains visible across all export formats (X, LinkedIn, Instagram).

**User Experience:** Users provide Team Name, Idea Headline, and Looking For roles. The generator outputs PNG images suitable for various social platforms, now featuring the updated branding and hashtag.

**Key Functional Changes (v0.1.1 Delta):**

*   **Layout:**
    *   Canvas base color changed to #FFFFFF.
    *   A 40px high safe area reserved at the bottom for the hashtag.
    *   Padding remains 120px on top, left, and right for main content.
*   **Hashtag:**
    *   Fixed text: "#LATAMACELERA".
    *   Color: #FF2A2A.
    *   Font Size: 16px (or equivalent responsive unit), Weight: 600.
    *   Position: Bottom-left (x=120px, vertically centered within the 40px bar).
*   **Exports:** Must ensure the hashtag area is not cropped during resizing/scaling for different platform dimensions.

**Typography:**

*   Team name: 20px bold, top-right.
*   Headline: 96px (72px mobile), weight 700.
*   "Looking for": 48px.
*   Hashtag: 16px, weight 600. 