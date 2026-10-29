# GiftVerse

Browser-playable 2D RPG prototype focused on the researcher hero, tap-to-move exploration, and animation integration.

## Play the game

Open `index.html` in a modern browser or serve the repository as a static site. The prototype includes tap-to-move navigation, the existing forest map, Orin dialogue, EchoCast trace-search, a forest guardian encounter, HUD, and local progress saving.

The environment and map remain unchanged during the current character-animation milestone.

## Procedural researcher character

The researcher is generated from original SVG paths and shapes in code; reference images are used as design references, not cropped into sprites. The generator creates **264 frames** across nine states and four directions:

- Idle, Walk, Run, Attack
- EchoCast (search/reveal traces, not an attack)
- Interact, MenuEnter, Hit, Death

Each frame uses a transparent 128×128 canvas and the shared feet pivot (64, 116). The generated SVG frames are packed into an atlas with JSON metadata and rasterized to a PNG atlas used by the game renderer.

- Generator: `tools/generate-researcher-svg.mjs`
- Atlas packer: `tools/package-researcher-assets.mjs`
- PNG export: `tools/rasterize-researcher-atlas.mjs`
- Animation preview: `assets/characters/researcher/procedural/preview.html`
- Metadata: `assets/characters/researcher/procedural/researcher-atlas.json`

The current vector art is an initial procedural pass, not final production-approved artwork. The silhouette, anatomy, face, costume, equipment, and movement still need visual comparison against the supplied reference before sign-off. The character renderer is integrated into `index.html`.

## Requirements preserved

- Tap-to-move remains the movement scheme.
- Keep the existing map and environment unchanged during the character milestone.
- Preserve the reference design: young dark-haired male researcher, long dark coat/cloak, blue and gold accents, straps, bags, and scientific equipment.
- Keep transparent frames, stable pivot, and consistent costume across directions.
- EchoCast reveals traces; it is not a combat attack.
- Do not crop the reference image or treat primitive placeholders as final art.

## Validation

GitHub Actions validates the inline game JavaScript, generates the procedural frames, packages the atlas, exports the PNG atlas, verifies frame metadata and asset presence, and checks the legacy sprite module no longer embeds extracted PNGs. These checks establish source/data integrity; they do not replace visual testing on a phone.

## Test deployment

The repository includes a GitHub Pages workflow. GitHub Pages is not yet enabled for this repository; the workflow cannot enable it automatically with the current GitHub App permissions. Once Pages is enabled in repository Settings → Pages with source set to GitHub Actions, the workflow can publish the browser test build.
