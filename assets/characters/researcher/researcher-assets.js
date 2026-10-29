export const heroAssetData = Object.freeze({});
export const heroAnimationCatalog = Object.freeze({});
export function getHeroAnimation() {
  throw new Error("Legacy extracted sprites are disabled. Use the procedural SVG atlas in ./procedural/researcher-atlas.json.");
}
export function drawHeroFrame() {
  throw new Error("Legacy extracted sprites are disabled. Use the procedural SVG atlas renderer integrated into GiftVerse.");
}
