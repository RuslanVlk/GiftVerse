#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "assets/characters/researcher/character.json");
const atlasPath = path.resolve(root, process.argv[2] ?? "assets/characters/researcher/researcher-atlas.json");
const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { fail(`Cannot read JSON ${path.relative(root, file)}: ${error.message}`); return null; }
}

const manifest = readJson(manifestPath);
if (!manifest) {
  console.error(errors.join("\n"));
  process.exit(1);
}
if (!fs.existsSync(atlasPath)) {
  console.error(`Atlas not found: ${path.relative(root, atlasPath)}`);
  console.error("Pass the atlas JSON path as the first argument once generated.");
  process.exit(2);
}
const atlas = readJson(atlasPath);
if (!atlas) {
  console.error(errors.join("\n"));
  process.exit(1);
}

// Supported atlas contract: { image, frameWidth, frameHeight, frames: [...] }
// Each frame: { animation, direction, index, x, y, width, height, pivotX, pivotY }.
const frames = Array.isArray(atlas.frames) ? atlas.frames : null;
if (!frames) fail("Atlas must contain a frames array.");
if (atlas.frameWidth !== manifest.rendering.frameWidth) fail(`frameWidth must be ${manifest.rendering.frameWidth}.`);
if (atlas.frameHeight !== manifest.rendering.frameHeight) fail(`frameHeight must be ${manifest.rendering.frameHeight}.`);

const imagePath = atlas.image ? path.resolve(path.dirname(atlasPath), atlas.image) : null;
if (!imagePath || !fs.existsSync(imagePath)) fail(`Atlas image is missing: ${atlas.image ?? "(no image field)"}`);

if (frames) {
  const keys = new Set();
  for (const frame of frames) {
    const key = `${frame.animation}/${frame.direction}/${frame.index}`;
    if (keys.has(key)) fail(`Duplicate frame: ${key}`);
    keys.add(key);
    for (const field of ["animation", "direction", "index", "x", "y", "width", "height", "pivotX", "pivotY"]) {
      if (!(field in frame)) fail(`Frame ${key} is missing field: ${field}`);
    }
    if (!manifest.rendering.directions.includes(frame.direction)) fail(`Unknown direction in ${key}: ${frame.direction}`);
    if (frame.width !== manifest.rendering.frameWidth || frame.height !== manifest.rendering.frameHeight) {
      fail(`Frame ${key} is not ${manifest.rendering.frameWidth}×${manifest.rendering.frameHeight}`);
    }
    if (frame.pivotX !== manifest.rendering.pivot.x || frame.pivotY !== manifest.rendering.pivot.y) {
      fail(`Frame ${key} has inconsistent pivot; expected (${manifest.rendering.pivot.x}, ${manifest.rendering.pivot.y})`);
    }
  }
  for (const [animation, spec] of Object.entries(manifest.animations)) {
    for (const direction of manifest.rendering.directions) {
      for (let index = 0; index < spec.frames; index++) {
        if (!keys.has(`${animation}/${direction}/${index}`)) {
          fail(`Missing frame: ${animation}/${direction}/${index}`);
        }
      }
    }
  }
}
if (errors.length) {
  console.error(`Hero atlas validation failed (${errors.length} error(s)):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Hero atlas valid: ${frames.length} frames across ${Object.keys(manifest.animations).length} animation states.`);
if (warnings.length) console.warn(warnings.join("\n"));
