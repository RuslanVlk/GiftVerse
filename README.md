# GiftVerse

A 2D RPG prototype with the current milestone focused on the main researcher character and animation system.

## Playable prototype

The root `index.html` contains the existing browser-playable prototype. It includes tap-to-move navigation, the forest map, Orin dialogue, the EchoCast trace-search mechanic, combat with the forest guardian, HUD, and local progress saving.

The map and environment are intentionally out of scope for the current character-animation milestone.

## Character animation workbench

Open `assets/characters/researcher/preview.html` through a static web server to inspect and export the currently embedded source frames. The preview supports frame-by-frame inspection, playback speed, horizontal flip, PNG spritesheet export, and JSON atlas export.

The current embedded game assets contain source frames for **Idle** and **Attack** only. They do not constitute the full production set. Walk, Run, EchoCast character poses, Interact, Hit, and all four directional sets still require proper art frames matching the supplied researcher reference.

Exports from the preview are explicitly marked `sourceOnly: true`. They are useful as source atlases and should not be mistaken for a complete production atlas.

## Requirements

- **Tap-to-move** remains the movement scheme.
- Keep the existing map, environment, and interface unchanged during the character milestone.
- Preserve the researcher reference: dark hair, dark long coat/cloak, blue and gold accents, straps, bags, and scientific equipment.
- Keep transparent RGBA frames and a stable feet pivot at (64, 116) in 128×128 cells.
- **EchoCast** is a search ability that reveals traces, not an attack.
- Do not use cropped reference art or primitive geometric placeholders as final character art.

## Validation

GitHub Actions checks the embedded source frames, ES module syntax, and the inline JavaScript syntax in the playable prototype.

The checks confirm code and source-data integrity; they do not claim that the missing production animation frames have been completed or that visual gameplay has been manually verified on every device.


## Procedural researcher generator

The first procedural researcher pass is now integrated into the playable prototype through a single SVG atlas. `tools/generate-researcher-svg.mjs` generates original SVG frames from code rather than cropping the supplied reference image; `tools/package-researcher-assets.mjs` validates and packs the frames. The committed atlas contains 264 frames across nine states (Idle, Walk, Run, Attack, EchoCast, Interact, MenuEnter, Hit, Death) and four directions. GitHub Actions regenerates and validates the atlas and commits the output automatically.

This remains a technical procedural-art pass, not final production-quality art matched to the supplied reference. The renderer is wired into gameplay, but the silhouette, anatomy, costume detail and movement still require visual refinement before the character can be considered finished. The reference image is a design authority only; it is not cropped into a character sprite.
