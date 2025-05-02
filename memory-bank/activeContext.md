# Active Context: v0.1.1 Implementation

**Current Goal:** Implement the visual and functional changes outlined in PRD Patch v0.1.1.

**Key Tasks:**

1.  **Setup:** Integrate 'Inter' font, add `white` theme.
2.  **`CardCanvas` Refactor:** Update rendering logic for new theme, font usage, hashtag, and bottom safe area.
3.  **Preview Update:** Implement mobile font size switching in the wrapper component.
4.  **Testing & Docs:** Verify functionality, QA checks, update screenshots.

**Status:** Phase 1 (Setup & Configuration) in progress.

**Decisions Made:**

*   Add `white` as a new theme, preserving `default`.
*   Use Google Fonts for 'Inter'.
*   Confirm export logic requires no changes for hashtag visibility.
*   Mobile preview scaling handled outside `CardCanvas`.
*   Hashtag uses absolute 16px size.

**Next Steps:**

*   Complete Phase 1: Font Integration & Theme Definition. 