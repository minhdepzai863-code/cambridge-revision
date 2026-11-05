---
name: Cambridge Revision
description: A precise, calm academic workspace for real paper evidence.
colors:
  action: "#24272b"
  on-action: "#ffffff"
  canvas: "#f6f6f4"
  surface: "#ffffff"
  sidebar: "#f0f0ee"
  ink: "#24272b"
  text: "#42474d"
  muted: "#61666d"
  divider: "#dfe1e3"
  silver: "#c7ccd1"
  soft: "#eaecee"
  hover: "#eeefef"
  input-line: "#b8bdc3"
  focus: "#667d8d"
  selection: "#dce3e7"
  chart-line: "#667d8d"
  chart-slate: "#a8bac7"
  nav-active: "#e3e5e5"
  feature-muted: "#d4d6d9"
  dark-canvas: "#191a1c"
  dark-surface: "#24272b"
  dark-sidebar: "#1e2023"
  dark-ink: "#f5f5f3"
  dark-muted: "#bbc0c5"
  dark-feature: "#303337"
typography:
  headline:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "32px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-1px"
  title:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-0.5px"
  body:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 550
    letterSpacing: "0"
  primary-measure:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "42px"
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-1.6px"
rounded:
  control: "7px"
  surface: "12px"
  dialog: "14px"
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
    backgroundColor: "{colors.nav-active}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 13px"
  feature-panel:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: Cambridge Revision

## Overview

**Creative North Star: "The Academic Workspace"**

A calm working environment where the evidence of study carries the visual weight. Apple minimalism supplies restraint, Linear supplies precision, Attio supplies record organization, and Things supplies straightforward lists. The interface uses one coherent sans-serif family, open alignment and a small number of distinct surface treatments.

Light mode is the primary identity. White analytical surfaces sit on warm off-white; charcoal provides text, actions and intentional feature areas. Dark mode uses neutral charcoal rather than a navy wash. The existing labelled sidebar and Study tools disclosure remain the navigation grammar. The second approved pass removes the notebook grid and decorative subject-cover shelf.

**Key Characteristics:**

- Open reading areas and compact, aligned records.
- Deliberate numerical hierarchy with tabular data.
- Quiet neutral controls with restrained slate-blue chart roles.
- Short state transitions and full reduced-motion support.

## Colors

Neutral reading surfaces dominate; slate is reserved for analytical and focus roles. The frontmatter owns the exact light and dark values.

### Primary

- **Charcoal action:** primary buttons, strong text and the examination feature.
- **Slate chart line and focus:** analytical traces and visible keyboard focus.
- **Slate blue:** secondary analytical values, never a wash across the application.

### Neutral

- **Warm canvas / white surface:** the uninterrupted page and elevated reading areas.
- **Quiet sidebar / selected navigation:** a slightly denser navigation plane with an explicit selected row.
- **Charcoal ink / body text / muted text:** distinct reading roles; muted text remains readable metadata.
- **Silver:** the appearance swatch outline; normal record separators use the lighter divider token.
- **Charcoal dark canvas / surface / feature:** separate neutral planes with pale text. Existing Paper and Sage choices retain their own palette roles; they are alternatives, not the default identity.

**The Role Consistency Rule.** Assign colour through shared reading, action, focus and analytical roles so controls remain legible across themes.

## Typography

**Display and body font:** self-hosted Manrope, with Segoe UI and sans-serif fallbacks. The variable font supports the interface's intermediate weights. Use the same family for numerals, labels and forms.

The headline, title, body and primary numerical measure in the frontmatter describe the desktop hierarchy. Headlines step to 31px below 1200px and 29px on mobile. Overview secondary measures are 29px on desktop and 24px on mobile; the average remains the strongest measure at 40px on mobile. Section titles generally range from 16–19px. Supporting content ranges from 11–14px; important metadata is at least 11px in the redesigned Overview and library.

**The Evidence Scale Rule.** A result earns size through importance. Marks, time and counts use tabular numerals; labels explain each measure without competing with it.

Chart labels use SVG coordinates: 28 units on desktop and 12 units in the horizontally scrollable mobile plot. Judge their rendered size, not only their source font size. The verified 990px viewport renders axes at approximately 12.19px; the mobile plot preserves approximately 11.25px labels.

## Layout

A labelled sidebar occupies 220px on desktop. Main content has a 1600px maximum width and 36px side padding, reducing to 27px below 1200px and 20px on mobile. The mobile sidebar becomes an off-canvas drawer at 760px; main content then spans the viewport.

Use meaningful changes in geometry: open measures, analytical surfaces, compact lists and a limited feature plane. Keep tight spacing inside a record and larger gaps between tasks. The Overview's specific performance/exam/recent/subject arrangement belongs to its surface contract rather than every future page.

Forms group existing fields under score, time, question counts and reflection headings. At narrow widths fields become one column, with 16px input text. Document records collapse their columns without losing identity, attachment actions or attempt history. Charts may scroll inside their own labelled region; they must not create page overflow.

**The Open Record Rule.** Use alignment and quiet separators to organize repeated work instead of turning every item into a bordered card.

## Elevation & Depth

Most surfaces are flat and borderless. White surfaces against the warm canvas provide tonal depth. Analytical and library surfaces use a small downward soft shadow; the examination feature relies on charcoal contrast. Row separators and input outlines communicate structure, not decoration.

The analytical surface shadow is `0 5px 22px rgba(24,28,32,.035)`. Subject selectors use `0 2px 5px rgba(24,28,32,.04)`. Modal dialogs retain their stronger `0 20px 65px rgba(15,25,40,.2)` shadow and a subdued backdrop.

**The Purposeful Depth Rule.** Elevate a reading surface or an interruption; keep ordinary records visually open.

## Shapes

Controls use gently squared corners; major reading surfaces use the larger surface radius. Dialogs retain the dialog radius. Lists use shared edges and light row dividers. Small attachment chips use 5px corners; selected navigation uses the control radius. Avoid repeating the same rounded container at every level.

## Components

### Buttons

Primary buttons use the action/on-action roles, compact control geometry and a 37px minimum desktop height. Quiet actions use transparent backgrounds and acquire the hover surface. Primary hover reduces brightness slightly. Disabled controls use half opacity with a not-allowed cursor. Focus is a 2px role-coloured outline offset by 3px.

### Fields

White reading surfaces, input-line outlines and the control radius make fields distinguishable without heavy frames. Desktop text is 14px; mobile text is 16px. Labels remain close to their fields. Error text retains the existing danger role and recovery wording. Do not reinterpret validation through visual styling.

### Navigation and selectors

Five labelled primary destinations remain visible; Study tools groups secondary destinations. The selected row uses a neutral tonal fill and stronger weight. Icons share the existing authored SVG stroke language. The subject selector uses a sideways arrow and the existing drawer; level selection uses a quiet segmented control with a white selected segment in light mode.

### Analytical surfaces and feature panels

Analytical surfaces are borderless, softly elevated and internally spacious. The intentional charcoal feature uses pale supporting text and no decorative imagery. Empty charts explain the actual next action without generating sample scores. The scrollable mobile chart includes a visible scrolling hint and a focusable region.

### Document and subject records

Paper records align identity, documents, latest attempt, best full-paper score and existing actions. Attachments are small neutral chips; attempt history is visibly separated in details. Subjects use compact rows with a small SVG symbol, name, syllabus code, actual measures and a syllabus action. Repeated records stay readable without decorative cover art.

### Motion

Buttons transition colour, border and shadow in 160ms. Existing dialogs use a 160ms ease-out entrance with a short vertical movement; the sidebar retains its short slide. Do not scatter animated entrances across every panel. Reduced-motion preference disables transitions, animations and smooth scrolling.

## Do's and Don'ts

### Do

- **Do** give saved evidence and useful actions a clear reading order.
- **Do** keep labelled navigation, explicit focus states and readable supporting text.
- **Do** vary open lists, analytical surfaces and intentional feature areas according to their purpose.
- **Do** preserve existing data, routes and controls when extending this visual system.

### Don't

- **Don't** restore the notebook grid or decorative cover shelf to this approved workspace.
- **Don't** wash all surfaces in blue or rely on faint text for hierarchy.
- **Don't** turn every record into an identical bordered card.
- **Don't** invent scores, dates or chart data to fill empty states.
