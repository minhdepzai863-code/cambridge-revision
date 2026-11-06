---
name: Cambridge Revision
description: A precise, calm academic workspace for real paper evidence.
colors:
  action: "#24272c"
  on-action: "#f7f7f8"
  canvas: "#edeef0"
  surface: "#f7f7f8"
  sidebar: "#e5e7ea"
  ink: "#24272c"
  text: "#424b55"
  muted: "#626b75"
  divider: "#d9dde2"
  silver: "#c7ccd1"
  soft: "#e2e6ea"
  hover: "#dde2e7"
  input-line: "#7c8996"
  focus: "#5e7385"
  selection: "#ccd7e0"
  chart-line: "#5e7385"
  chart-slate: "#6e8497"
  nav-active: "#d3d9df"
  feature-muted: "#d4d6d9"
  dark-canvas: "#191a1c"
  dark-surface: "#24272b"
  dark-sidebar: "#1e2023"
  dark-ink: "#f5f5f3"
  dark-muted: "#bbc0c5"
  dark-feature: "#303337"
  elevated: "#ffffff"
  accent: "#8197aa"
  sage-muted: "#5e6d63"
  folder-back: "#b7c0c9"
  folder-front: "#d4dbe1"
  folder-edge: "#8996a2"
  folder-page: "#f7f7f8"
  dark-folder-back: "#4e5963"
  dark-folder-front: "#717e89"
  dark-folder-edge: "#9aa7b2"
  dark-folder-page: "#d0d6dc"
  subject-backplate: "#24272c"
  dark-subject-backplate: "#111315"
typography:
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "36px"
    fontWeight: 450
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "24px"
    fontWeight: 450
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  collection:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "22px"
    fontWeight: 450
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "0"
  metadata:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  paper-code:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  primary-measure:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "42px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
rounded:
  control: "7px"
  surface: "12px"
  dialog: "14px"
  navigation: "10px"
  attachment: "5px"
spacing:
  compact: "8px"
  control-inline: "14px"
  related: "16px"
  section: "24px"
  page-inline: "36px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
    height: "37px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  nav-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.navigation}"
    padding: "9px 13px"
  feature-panel:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.surface}"
    padding: "24px"
  collection-tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "15px 24px 13px"
  attachment-chip:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.text}"
    rounded: "{rounded.attachment}"
    padding: "5px 8px"
  subject-mark:
    backgroundColor: "{colors.subject-backplate}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.control}"
    padding: "4px"
---

# Design System: Cambridge Revision

## Overview

**Creative North Star: "The Academic Workspace"**

A calm working environment where the evidence of study carries the visual weight. Apple minimalism supplies restraint, Linear supplies precision, Attio supplies record organization, and Things supplies straightforward lists. Newsreader gives major headings an editorial academic voice; Open Sans keeps functional evidence precise. Open alignment and a small number of distinct surface treatments preserve the calm workspace.

Light mode is the primary identity. Off-white analytical surfaces sit on a soft-silver canvas, with a slightly deeper silver sidebar. Charcoal provides text, actions and intentional feature areas. Pure white is reserved for elevated dialogs. Dark mode uses neutral charcoal rather than a navy wash. The existing labelled sidebar and Study tools disclosure remain the navigation grammar. The second approved pass removes the notebook grid and decorative subject-cover shelf. Its folder-library extension uses real subject collections, joined tab-and-body surfaces, grey folder silhouettes and charcoal subject-symbol backplates within the same visual world.

**Key Characteristics:**

- Open reading areas and compact, aligned records.
- Editorial serif headings paired with functional sans-serif evidence.
- Deliberate numerical hierarchy with tabular data.
- Quiet neutral controls with restrained slate-blue chart roles.
- Short state transitions and full reduced-motion support.
- Flat collection tabs and explicit document identities, with latest and best attempts kept distinct.

## Colors

Neutral reading surfaces dominate; slate is reserved for analytical and focus roles. The frontmatter owns the exact light and dark values.

### Primary

- **Charcoal action:** primary buttons, strong text and the examination feature.
- **Slate chart line and focus:** analytical traces and visible keyboard focus.
- **Slate blue:** secondary analytical values, never a wash across the application.

### Neutral

- **Soft-silver canvas / off-white surface:** the uninterrupted page and primary reading areas; a darker silver sidebar separates navigation.
- **Quiet sidebar / selected navigation:** a slightly denser navigation plane with an explicit selected row.
- **Charcoal ink / body text / muted text:** distinct reading roles; muted text remains readable metadata.
- **Silver:** the appearance swatch outline; normal record separators use the lighter divider token.
- **Charcoal dark canvas / surface / feature:** separate neutral planes with pale text. The six appearance choices remain Light, Paper, Sage, White, Dark and Device. Paper and Sage retain their own palette roles; Light and White share the current soft-silver treatment. Device resolves to the device preference. Sage supporting text uses the sage-muted role.

- **Folder planes:** back, front, edge and inset page are separate flat SVG fills. Their dark equivalents preserve the same silhouette without gradients.
- **Subject backplates:** charcoal carries the pale subject symbol in compact subject rows and the subject chooser; the dark subject register uses the black backplate. These marks identify subjects without colourful cover art.

**The Role Consistency Rule.** Assign colour through shared reading, action, focus and analytical roles so controls remain legible across themes.

## Typography

**Editorial font:** self-hosted Newsreader, with Georgia and serif fallbacks; normal variable weights 200–800. **Functional font:** self-hosted Open Sans, with Arial and sans-serif fallbacks; normal variable weights 300–800. Both are preloaded, use font-display swap, optical sizing and no synthesized styles. The production build includes these two font files and their OFL licences; retained legacy source fonts are excluded from production.

The frontmatter records the desktop roles. Editorial page headings step to 34px below 1200px and 32px at 760px, with a 1.2 mobile line height. Section headings use the title role; performance/review headings become 22px below 1200px and 23px on mobile. Collection headings become 21px on mobile. Empty-state headings are Newsreader at 24px/450/1.3, feature subheadings at 27px/450/1.3, dialog headings at 28px/450/1.2 and the brand at 22px/500/1.1. These are distinct from numerical emphasis.

Open Sans carries body text, scores, paper codes, tables, fields, navigation and buttons. Dense controls use the label role; primary buttons and selected navigation use weight 600. Supporting metadata uses its own readable role at full opacity. Desktop field text is 14px; mobile fields are 16px. The paper-detail code title remains functional sans at 27px/600/1.35 on mobile. The primary average measure becomes 38px on mobile. Page descriptions have a 68ch maximum; mobile descriptions use 14px/1.75.

**The Editorial and Evidence Rule.** Use Newsreader for major headings and Open Sans for functional information. Paper identifiers and numeric results remain sans-serif even when they occupy a heading-sized position. All six appearance choices preserve this relationship and weight hierarchy.

**The Evidence Scale Rule.** A result earns size through importance. Marks, time and counts use tabular numerals; labels explain each measure without competing with it.

Overview chart labels use Open Sans at weight 400 with tabular lining numerals. At chart-container widths of at least 600px they use 18 SVG units; at 480–599px they use 22; below 480px they use 26. At viewport widths of 959px and below the horizontally scrollable plot instead uses a 620px minimum SVG width and 18-unit text. Judge rendered labels, not SVG units: the reviewed 1440px desktop, 990px laptop and 390px mobile rendered labels at approximately 13.81px, 11.67px and 12.4px respectively. These rules belong to the Overview plot; default Progress chart geometry remains unchanged.

## Layout

A labelled sidebar occupies 220px on desktop. Main content has a 1600px maximum width and 36px side padding, reducing to 27px below 1200px and 20px on mobile. The mobile sidebar becomes an off-canvas drawer at 760px; main content then spans the viewport.

Use meaningful changes in geometry: open measures, analytical surfaces, compact lists and a limited feature plane. Keep tight spacing inside a record and larger gaps between tasks. The Overview's specific performance/exam/recent/subject arrangement belongs to its surface contract rather than every future page.

Forms group existing fields under score, time, question counts and reflection headings. At narrow widths fields become one column, with 16px input text. Document records collapse their columns without losing identity, attachment actions or attempt history. Charts may scroll inside their own labelled region; they must not create page overflow. The Overview plot uses a 900 × 340 viewBox with left/right gutters of 96/44, top/bottom gutters of 28/56 and the y-axis labels at x=76. Its header has a 22px lower gap and its caption a 16px upper gap. This explicit presentation layout does not change data grouping, percentages, moving averages or tooltip content.

The paper library groups records beneath real subject tabs. Each tab shares the reading-surface fill with its body, with square meeting corners and rounded outside corners. Desktop rows align paper/documents, latest attempt, best full paper and actions in four columns. Below 1100px actions move beneath the two score columns. At 760px the row becomes two columns: identity spans both, latest and best retain explicit labels, and actions share a separate bottom row. Attachment filenames wrap; their role remains visible beneath the filename on mobile.

**The Open Record Rule.** Use alignment and quiet separators to organize repeated work instead of turning every item into a bordered card.

## Elevation & Depth

Most surfaces are flat and borderless. Off-white surfaces against the soft-silver canvas provide tonal depth; analytical and library surfaces have no shadow in the neutral light theme. The examination feature retains its charcoal contrast. Row separators and input outlines communicate structure, not decoration.

Neutral-light analytical and library surfaces are flat. Subject selectors retain `0 2px 5px rgba(24,28,32,.04)`. Elevated light dialogs use pure white with `0 18px 60px rgba(36,39,44,.14)` and a neutral backdrop. Dark-mode elevation is unchanged.

**The Purposeful Depth Rule.** Elevate a reading surface or an interruption; keep ordinary records visually open.

## Shapes

Controls use gently squared corners; major reading surfaces use the larger surface radius. Dialogs retain the dialog radius. Lists use shared edges and light row dividers. Small attachment chips use 5px corners; selected navigation uses its own navigation radius. Collection tabs round only the top corners; their connected body keeps the top-left corner square. The folder silhouette uses three authored SVG paths: a tabbed back, inset page and sloped front, with a quiet edge stroke. It is geometry, not a decorative image or gradient. Avoid repeating the same rounded container at every level.

## Components

### Buttons

Primary buttons use the action/on-action roles, compact control geometry and a 37px minimum desktop height. Quiet actions use transparent backgrounds and acquire the hover surface. Primary hover reduces brightness slightly. Disabled controls use half opacity with a not-allowed cursor. Focus is a 2px role-coloured outline offset by 3px.

### Fields

Off-white reading surfaces, input-line outlines and the control radius make fields distinguishable without heavy frames. Desktop text is 14px; mobile text is 16px. Labels remain close to their fields. Error text retains the existing danger role and recovery wording. Do not reinterpret validation through visual styling.

### Navigation and selectors

Five labelled primary destinations remain visible; Study tools groups secondary destinations. The selected row uses a neutral tonal fill and stronger weight. In Light and White the selected row uses the reading-surface fill with a very small shadow (`0 1px 3px rgba(36,39,44,.035)`). Sidebar rows retain their labels and the navigation radius; do not introduce a collapsed rail. Icons share the existing authored SVG stroke language. The six subject marks are distinct authored SVGs: a terminal for Computer Science (9618), parabola for Mathematics (9709), pendulum for Physics (9702), summation for Further Mathematics (9231), flask for Chemistry (9701) and leaf for Biology (9700). Subject marks retain 1.5px strokes and the charcoal/black backplates. The subject selector uses a sideways arrow and the existing drawer; level selection uses a quiet segmented control with an off-white selected segment in light mode.

### Analytical surfaces and feature panels

Analytical surfaces are borderless, tonally separated and internally spacious. The intentional charcoal feature uses pale supporting text and no decorative imagery. Empty charts explain the actual next action without generating sample scores. The scrollable mobile chart includes a visible scrolling hint and a focusable region.

### Document and subject records

A subject collection joins a folder tab to a flat shared library body. The tab names the real subject and syllabus; an adjacent count describes its papers and attempts. Grey folder silhouettes use the shared folder-plane roles and scale from 44 × 35px to 36 × 29px on mobile. They do not add a new filesystem model.

Paper records align paper identity, document-role chips, latest attempt, best full-paper score and existing details/retry actions. Role chips open real attachments; filenames remain available in their accessible names and titles. Latest and best are separate measures, and partial attempts remain explicitly labelled. Empty libraries retain the same collection shape and the existing upload-and-log action.

Paper details group actual filenames, stored size/status, document roles and Open actions beneath a joined attachment tab. Editable rows retain the existing role selector and detach action. Mobile role badges remain visible in a second row. The attachment file list has zero outer margin so the tab and body meet continuously. The existing question-paper preview stays within this group; attempt history remains a separate reading section.

Subjects use compact rows with a pale authored SVG symbol on a charcoal backplate, name, syllabus code, actual measures and a syllabus action. The subject chooser uses the same charcoal symbol treatment and fully opaque supporting text. Repeated records stay readable without decorative cover art.

### Motion

Buttons transition colour, border and shadow in 160ms. Existing dialogs use a 160ms ease-out entrance with a short vertical movement; the sidebar retains its short slide. Do not scatter animated entrances across every panel. Reduced-motion preference disables transitions, animations and smooth scrolling.

## Do's and Don'ts

### Do

- **Do** give saved evidence and useful actions a clear reading order.
- **Do** keep labelled navigation, explicit focus states and readable supporting text.
- **Do** pair Newsreader headings with Open Sans controls, identifiers and numerical evidence.
- **Do** vary open lists, analytical surfaces and intentional feature areas according to their purpose.
- **Do** preserve existing data, routes and controls when extending this visual system.
- **Do** join collection tabs to their bodies and keep attachment roles visible at mobile widths.
- **Do** use real subject/document groupings and flat grey folder planes within the existing palette.

### Don't

- **Don't** restore the notebook grid or decorative cover shelf to this approved workspace.
- **Don't** wash all surfaces in blue or rely on faint text for hierarchy.
- **Don't** turn every record into an identical bordered card.
- **Don't** invent scores, dates or chart data to fill empty states.
- **Don't** turn folder styling into mock operating-system controls, a new Resources destination or a new upload mode.
