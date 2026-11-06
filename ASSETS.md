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
