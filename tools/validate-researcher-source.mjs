#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const sourcePath=path.join(root,"assets/characters/researcher/researcher-assets.js");
const previewPath=path.join(root,"assets/characters/researcher/preview.html");
const generatorPath=path.join(root,"tools/generate-researcher-svg.mjs");
const proceduralPreviewPath=path.join(root,"assets/characters/researcher/procedural/preview.html");
const errors=[];
const source=fs.existsSync(sourcePath)?fs.readFileSync(sourcePath,"utf8"):"";
const preview=fs.existsSync(previewPath)?fs.readFileSync(previewPath,"utf8"):"";
if(!source)errors.push("Legacy compatibility module is missing.");
if(/data:image\/png;base64,/.test(source))errors.push("Legacy module still embeds extracted PNG sprites.");
if(/hero_idle_\d+\.png|hero_attack_\d+\.png/.test(source))errors.push("Legacy module still references extracted hero frames.");
for(const token of ["getHeroAnimation","drawHeroFrame","Legacy extracted sprites are disabled"])if(!source.includes(token))errors.push("Compatibility module missing disabled API marker: "+token);
if(!preview.includes("procedural/preview.html"))errors.push("Legacy preview must redirect to the procedural editor.");
if(!fs.existsSync(generatorPath))errors.push("Procedural SVG generator is missing.");
if(!fs.existsSync(proceduralPreviewPath))errors.push("Procedural character preview is missing.");
if(errors.length){console.error("Researcher source validation failed:\n- "+errors.join("\n- "));process.exit(1);}
console.log("Researcher source validation passed: extracted sprite payload removed; procedural SVG workflow is the only character preview.");
