# Notebook illustrations

The original notebook-stack illustrations are retained as source artifacts. The second design pass no longer renders or ships either illustration. Both have transparent backgrounds.

Final blue-variant prompt:

> Edit the supplied notebook-stack illustration. Preserve the three-notebook isometric stack, small pencil, composition, precise outlines, and simple editorial style. Recolor the top notebook muted cornflower blue (#7198ca), middle notebook pale sky blue, bottom notebook warm ivory; use deep navy outlines (#19334d) and an understated ochre pencil. Remove ambient glow, halos, large soft shading, and scenery; retain a small contact shadow. Transparent background, clean alpha edges, no text, numbers, logos, UI, stars, ornaments, or extra objects. Readable at 200 pixels wide, with generous transparent padding.

## 6 November 2026 notebook cover set

Generated with the built-in image generation tool for the first presentation-only redesign. The user subsequently rejected the decorative cover grid. These assets are preserved as generated source artifacts, but are not rendered or included in the production bundle. Each subject has a coordinated front-on cloth notebook cover with an understated silver scientific motif and no rasterised UI text. Final web assets are 320×480 WebP files in assets/covers; original 1024×1536 PNGs remain under the Codex generated_images directory. Conversion changes delivery resolution and encoding only. Exact generation prompts are preserved in each .webp.json provenance sidecar; these development sidecars are excluded from the production build. The six optimized assets total approximately 200 KB.

- 9709: lavender, conic curve and axes.
- 9231: midnight blue, parametric curves.
- 9702: grey ochre, orbit and wave.
- 9618: sage, circuit traces.
- 9701: slate teal, molecular motif.
- 9700: forest green, leaf veins.

The old welcome illustrations remain in source history but are not included in the new production build. The first pass used DM Sans. The second pass uses the self-hosted Manrope variable font from the official Google Fonts repository, with its license in assets/fonts/Manrope-OFL.txt. Manrope is used consistently across interface text and numerical measures.


## Academic editorial fonts

The latest user-approved pairing uses Newsreader for editorial headings and Open Sans for functional UI and evidence. Both normal variable faces are self-hosted from the official Google Fonts repository (ofl/newsreader and ofl/opensans), with their unmodified SIL Open Font License files beside them. Only the two used faces are loaded; no university font files or identity artwork are included. Previous Manrope/DM Sans files remain source history and are excluded from the new production build.

The production CSS loads core WOFF2 subsets for common Latin, Vietnamese, and mathematical characters. Separate extended subsets cover the remaining source characters when needed. Both retain variable weights. Open Sans uses its normal width and Newsreader uses its 36-point optical cut.
# Landing page archive images

- `assets/pepys-library.jpg` is the Pepys Library interior from H. B. Wheatley's 1899 edition of *The Diary of Samuel Pepys: Pepysiana*. Public-domain photograph, sourced from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pepys_Library_Cambridge_interior.jpg). Served at 1280 × 898, with the source credited in the page caption.
- `assets/cambridge-library-etching.jpg` is Thomas Rowlandson's *Inside View of the Public Library, Cambridge* (1809), The Metropolitan Museum of Art, 59.533.1635. [The Met's object record](https://www.metmuseum.org/art/collection/search/786809) and [CC0 source image](https://commons.wikimedia.org/wiki/File:Inside_View_of_the_Public_Library,_Cambridge_MET_DP883794.jpg). Served at 1280 × 944 and lazy-loaded. The displayed image is cropped by CSS.


## Previous landing video

The desktop and mobile versions of `assets/alevel-study` use [Close-Up Shot of a Student Doing Homework](https://www.pexels.com/video/close-up-shot-of-a-student-doing-homework-8472444/) by MART PRODUCTION under the [Pexels License](https://www.pexels.com/legal-pages/license/). The edited footage shows a student using a pen, study papers and a calculator. The clip is silent and uses a short dissolve at the loop seam. The poster uses a still from the same edit. The paper shown in the walkthrough is separate and identified by its Cambridge paper reference.

## Revision desk share preview

The share image is a browser capture of the interactive landing preview. The paper reference and equation identify the source example, and the attempt marks are illustrative. The current hero uses HTML and CSS. The earlier video is retained in the source assets for provenance.
