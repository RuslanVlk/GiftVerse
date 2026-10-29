#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "assets/characters/researcher/researcher-assets.js");
const previewPath = path.join(root, "assets/characters/researcher/preview.html");
const errors = [];
const source = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, "utf8") : "";
const preview = fs.existsSync(previewPath) ? fs.readFileSync(previewPath, "utf8") : "";

if (!source) errors.push("researcher-assets.js is missing or empty.");
if (!preview) errors.push("preview.html is missing or empty.");

const assetMatch = source.match(/export const heroAssetData = (\{.*?\});\s*\n\nexport const heroAnimationCatalog/s);
if (!assetMatch) {
  errors.push("Could not parse embedded heroAssetData object.");
} else {
  let assets;
  try { assets = JSON.parse(assetMatch[1]); }
  catch (error) { errors.push("Embedded asset JSON is invalid: " + error.message); }
  if (assets) {
    const names = Object.keys(assets);
    const idle = names.filter(name => /^hero_idle_\d+\.png$/.test(name));
    const attack = names.filter(name => /^hero_attack_\d+\.png$/.test(name));
    if (idle.length !== 8) errors.push(`Expected 8 idle frames; found ${idle.length}.`);
    if (attack.length !== 8) errors.push(`Expected 8 attack source frames; found ${attack.length}.`);
    for (const [name, dataUri] of Object.entries(assets)) {
      const match = dataUri.match(/^data:image\/png;base64,([A-Za-z0-9+/=]+)$/);
      if (!match) { errors.push(`${name} is not a PNG data URI.`); continue; }
      const bytes = Buffer.from(match[1], "base64");
      if (bytes.length < 8 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
        errors.push(`${name} has an invalid PNG signature.`);
      }
    }
    console.log(`Found ${names.length} embedded hero frames (${idle.length} idle, ${attack.length} attack).`);
  }
}
for (const required of ["getHeroAnimation", "drawHeroFrame", "heroAnimationCatalog"]) {
  if (!source.includes(required)) errors.push(`Missing asset API: ${required}`);
}
for (const required of ['id="animation"', 'id="frames"', 'function exportAtlas', 'researcher-assets.js']) {
  if (!preview.includes(required)) errors.push(`Preview missing feature marker: ${required}`);
}
if (errors.length) {
  console.error("Researcher source validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Researcher source validation passed. Note: this validates existing source frames only, not missing animation states.");
