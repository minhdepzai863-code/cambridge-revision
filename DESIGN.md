---
name: Cambridge Revision
description: An independent study folio for Cambridge AS and A Level papers, marks and corrections.
colors:
  ground: "#f7f6f2"
  surface: "#fdfcf9"
  elevated: "#fffefa"
  sidebar: "#eeede8"
  ink: "#242625"
  text: "#3d403d"
  muted: "#5f645f"
  line: "#d9dbd4"
  soft: "#eeefe9"
  green: "#e5ebe5"
  hover: "#eaece5"
  input-line: "#878d84"
  input-hover: "#626b61"
  focus: "#526b60"
  selection: "#d8e3da"
  action: "#303632"
  on-action: "#fffefa"
  accent: "#526b60"
  nav-active: "#dfe7df"
  nav-on-active: "#23352d"
  chart-high: "#526b60"
  chart-mid: "#7a9084"
  chart-low: "#e1e8e1"
  dark-ground: "#171817"
  dark-surface: "#222322"
  dark-elevated: "#282a28"
  dark-sidebar: "#1d1e1d"
  dark-ink: "#f4f3ef"
  dark-text: "#dddfd9"
  dark-muted: "#b7bdb6"
  dark-line: "#414541"
  dark-soft: "#2c2e2c"
  dark-green: "#303d34"
  dark-hover: "#333632"
  dark-input-line: "#828b81"
  dark-input-hover: "#b4bdb2"
  dark-focus: "#afc7b8"
  dark-selection: "#3c5246"
  dark-action: "#e5ebe5"
  dark-on-action: "#212722"
  dark-accent: "#afc7b8"
  dark-nav-active: "#323e36"
  dark-nav-on-active: "#ecf1eb"
  dark-chart-high: "#afc7b8"
  dark-chart-mid: "#839b8c"
  dark-chart-low: "#3b483f"
  folder-back: "#babfb8"
  folder-front: "#d5d8d0"
  folder-edge: "#818980"
  folder-page: "#f7f7f8"
  dark-folder-back: "#535b53"
  dark-folder-front: "#747f74"
  dark-folder-edge: "#9da99d"
  dark-folder-page: "#d0d6dc"
  success: "#3b5e32"
  success-bg: "#eaf3e1"
  warning: "#805820"
  warning-bg: "#fbf1df"
  danger: "#954336"
  danger-bg: "#fff8f4"
  dark-success: "#d0e7b8"
  dark-success-bg: "#35472b"
  dark-warning: "#f2d4a0"
  dark-warning-bg: "#493e28"
  dark-danger: "#ffbba8"
  dark-danger-bg: "#4a342d"
  subject-backplate: "#24272c"
  dark-subject-backplate: "#111315"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(54px, 5.8vw, 90px)"
    fontWeight: 450
    lineHeight: 0.99
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(34px, 4vw, 49px)"
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
  control:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  label:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 650
  metadata:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.65
  paper-code:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  primary-measure:
    fontFamily: "Open Sans, Arial, sans-serif"
    fontSize: "clamp(25px, 3vw, 42px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
rounded:
  archive: "3px"
  chip: "5px"
  field: "7px"
  control: "7px"
  book-mark: "8px"
  navigation: "7px"
  tour: "10px"
  task: "11px"
  collection: "12px"
  ledger: "13px"
  dialog: "14px"
spacing:
  control-gap: "8px"
  control-inline: "14px"
  task-inline: "24px"
  workspace-inline: "36px"
  folio-inline: "40px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
    height: "42px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "42px"
  nav-selected:
    backgroundColor: "{colors.nav-active}"
    textColor: "{colors.nav-on-active}"
    rounded: "{rounded.navigation}"
    padding: "7px 9px"
  next-task:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.task}"
    padding: "20px 24px"
  sample-ledger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ledger}"
  collection-tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "15px 24px 13px"
  attachment-chip:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.text}"
    rounded: "{rounded.chip}"
    padding: "5px 8px"
---

# Design System: Cambridge Revision

## Overview

**Creative North Star: "A student's working folio"**

Cambridge Revision brings paper records, marks and corrections into one study sequence. Ivory, stone and warm-white surfaces frame the work in light mode. Neutral charcoal carries the same hierarchy in dark mode. Newsreader gives the page an editorial voice, and Open Sans keeps controls and results easy to scan.

The public folio introduces the method with a credited archival photograph and an explicitly labelled sample record. The workspace carries that visual language into private or device-local study, where the next action, exam preparation and actual saved evidence lead the page. The open-book symbol and name identify an independent tool.

**Key Characteristics:**

- Shared ivory and charcoal themes across public, account and workspace pages.
- Editorial headings with functional labels, codes and tabular numerical evidence.
- Credited archival imagery on the public folio and quiet, data-led workspace surfaces.
- Navigation grouped around planning, practice, review and reference.
- Aligned records and restrained color for selection, progress and feedback.

## Colors

[folio.css](folio.css) supplies the shared palette after the base workspace styles. Ivory ground is the continuous page, stone sets apart the sidebar and tour, and warm white carries records, fields and the primary next action. Charcoal ink anchors headings and values. Body and muted text have separate roles, while the line and input-line tokens distinguish dividers from interactive boundaries.

Slate-green supplies the accent, focus ring, analytical traces and the light-to-deep activity scale. Current navigation uses a tinted fill and a stronger foreground. Hover, text selection and the sample ledger's next-review callout use their own fills. The primary action uses charcoal with pale text in Ivory and pale green with charcoal text in Dark.

Dark keeps the page, sidebar, reading surface and interactive states distinct with neutral charcoal and pale ink. Settings offers Ivory, Dark and Device. Device follows the operating-system preference. Previously saved light-theme options resolve to the same Ivory palette. The public header switches between the two palettes.

Success, warning and danger come from the existing semantic roles in [style.css](style.css). Keep their labels and recovery wording with the color cues. The public account form also presents submission errors in a readable alert on a soft background.

**The Role Consistency Rule.** Reuse shared surface, action, focus and analytical roles across pages and themes.

## Typography

Both variable fonts are self-hosted and preloaded. Newsreader uses normal weights 200–800 with Georgia as fallback. Open Sans uses normal weights 300–800 with Arial as fallback. The stylesheet enables optical sizing and disables synthesized styles.

The public hero uses the display role at weight 450. At 760px and below it scales with `clamp(43px, 11vw, 64px)`. Workspace page headings use the headline role and a 1.2 line height on mobile. Collection headings use 22px on desktop and 21px on mobile. The paper detail code stays Open Sans at 30px on desktop and 27px on mobile.

Open Sans carries labels, controls, filters, body text, charts, filenames and paper codes. Primary actions and selected navigation use weight 600. Supporting workspace metadata generally uses 12px at full opacity. Form controls use 14px on desktop and 16px at mobile widths.

**The Editorial and Evidence Rule.** Use Newsreader for editorial headings and Open Sans for functional information. Marks, time and counts use tabular numerals.

## Layout

The folio is centered at up to 1240px with 40px side gutters, 24px at 1040px and below, and 18px at 760px and below. On desktop the headline and actions sit beside the photograph. The three numbered method steps share a ruled strip. The tour places its explanation beside the paper ledger. A credited archival print follows the feature list before the closing action. At 760px these sections stack, and the public header keeps the appearance and account actions visible. Account pages stack with the form first.

The workspace uses a 240px sidebar, a 65px compact rail and a content area capped at 1430px. Main padding steps from 36px to 27px below 1200px and 20px at 760px and below. The top bar keeps the current location and paper logging action in reach. At 760px the workspace spans the viewport and navigation opens as a drawer up to 300px or 85vw, whichever is smaller.

The dashboard places the next task beside the examination note, then shows five open measures. The measures reflow to three columns at 1040px and two at 760px. Performance and study activity sit side by side on wide screens. At 1090px performance spans the full row. At 760px the next task and examination note stack, and the remaining sections flow in order from performance through activity, recent work, review and subjects. The performance plot has a focusable scroll region at 959px and below, with a 620px minimum chart width and a visible scroll hint.

Paper search puts the field and apply action side by side on wide screens and wraps the action beneath the field on mobile. Paper rows align identity and documents, latest attempt, best full paper and actions in four desktop columns. At 1100px and below the actions move beneath the score columns. At 760px and below the identity spans both columns, scores keep their labels, and actions have a separate bottom row. Attachment names wrap, with the role visible on a second line.

**The Open Record Rule.** Use alignment and quiet rules to organize repeated records.

## Elevation & Depth

Tonal separation and fine rules do most of the work. The sample ledger has a soft shadow (`0 14px 40px rgb(24 27 24 / .07)`) inside the stone tour. A tinted next-task panel leads the dashboard. A quieter examination panel sits beside it on wider screens and follows it on phones. Paper collections share a flat reading surface. Dialogs interrupt with a backdrop and shadow. Ivory dialogs use an elevated warm-white surface and `0 18px 60px rgba(36,39,44,.14)`.

## Shapes

The public book mark uses 8px corners. Standard buttons, fields and selected navigation use 7px. Attachment chips use 5px, archival images 3px and the ledger 13px. Folder tabs round the top corners and share a square join with the reading plane below. The folder silhouette is three flat SVG paths for the tabbed back, inset page and sloped front.

## Components

### Public header, dashboard preview and paper walkthrough

The header pairs the open-book mark with the Cambridge Revision name and an independent-workspace descriptor. Dashboard preview and How it works are landing anchors. The compact header retains the 44px appearance button, Log in and Get started. Signed-in visitors see Open dashboard. The footer identifies the independent project and links to the local workspace.

The public hero uses a full-height film with top navigation and a bottom-aligned headline, supporting copy and paired actions. Warm ink, ivory and restrained brass apply to the public stage. The split paper tablet follows the hero. A scroll-driven route leads into the walkthrough, and the rendered Overview appears below it with marks and activity labelled as demo data.

The four-step walkthrough uses a stable frame, shared question marks table and a supplied exam-preparation photograph. Each tab has a visible focus state and supports pointer, touch, arrow keys, Home and End. The example adapts Cambridge International 9709/11 May/June 2024 Q1 and its published marking guidance. The sample working and marks are labelled as demo data.

### Workspace navigation

- **Workspace** groups Dashboard, Study plan and Analytics.
- **Practice** groups Past papers, Focused study, Subjects & syllabus and Question bank.
- **Review** groups History, Mistakes, Bookmarks and Review queue.
- **Resources** groups Examination planner, Grade thresholds and Grade calculator.

Group headings are native disclosures. Workspace and Review open initially, and the current group opens when a destination within it is shown. A slate-green fill marks the current route, and the Review queue count appears when work is due. The navigation area scrolls independently of the anchored Profile, Settings & backup and Appearance controls. The footer identifies the current account or device-local workspace and shows Sign out in a cloud workspace.

The compact desktop rail keeps destination names available to assistive technology and through tooltips. The mobile drawer uses a scrim, 44px minimum navigation targets, a close control and keyboard focus containment. Escape closes the drawer and returns focus to its trigger.

### Buttons, fields and states

The standard button minimum is 42px. Primary buttons use the action pair and soften on hover. Quiet buttons use a transparent background with a hover fill. Fields use the surface and input-line roles with readable placeholders. Links, buttons, fields and disclosure summaries use a 2px focus outline with a 3px offset. Keep busy, disabled, success, warning and error states tied to the operation and its text.

### Study evidence

The dashboard shows the next useful action, a confirmed exam date or a prompt to add one, and measures drawn from saved work. Score trends use the slate-green analytical roles. Study activity pairs intensity with a day label and an explicit selected outline. Empty views explain the next available action.

Subject collections attach the tab to a shared reading surface. Document role chips open the corresponding files, and records distinguish latest attempts from best full-paper results. File details show name, size, stored status and role. Compact subject entries use six authored monochrome glyphs on charcoal or black backplates.

### Motion

Standard button states transition in 160ms. Dialogs use a 160ms ease-out entrance and the subject drawer uses a 200ms slide. The compact hero film fades into the paper surface and autoplays while visible. The Appearance menu contains the Background motion setting. Smaller screens get a smaller video; reduced-motion and data-saving users start on the poster. In the tablet preview, the pen sweeps to the question, draws an underline, then points to the mark scheme and returns to the edge of the tablet. It runs when the tablet first comes into view and when the Upload step is reopened. The journey trace follows scroll progress and its four steps are the walkthrough tabs. Pointer-triggered tab changes use a 180ms fade and short translation while keeping the step controls in place. Dashboard route changes use a 140ms fade for pointer navigation. Reduced motion starts with the poster and a completed trace, and omits automatic pen playback, tab and route movement, and smooth scrolling.

## Do's and Don'ts

- Do give the next useful task and saved evidence a clear reading order.
- Do pair editorial headings with functional labels, codes and tabular results.
- Do keep route, focus and progress states legible in both themes.
- Do credit sourced sample questions and label illustrative scores as demo data.
- Do keep file roles, attempt scope and score labels visible at narrow widths.
- Don't invent scores, grades, exam dates or provenance for workspace records.
- Don't use institutional logos, arms or wordmarks for the independent project.
