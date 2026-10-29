#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const base=path.join(root,"assets/characters/researcher/procedural");
const manifest=JSON.parse(fs.readFileSync(path.join(base,"manifest.json"),"utf8"));
const atlas=JSON.parse(fs.readFileSync(path.join(base,"researcher-atlas.json"),"utf8"));
const atlasSvg=fs.readFileSync(path.join(base,"researcher-atlas.svg"),"utf8");
const game=fs.readFileSync(path.join(root,"index.html"),"utf8");
const errors=[];
const expected=Object.values(manifest.animations).reduce((n,a)=>n+a.count*manifest.directions.length,0);
if(atlas.frameCount!==expected)errors.push(`Atlas declares ${atlas.frameCount} frames; expected ${expected}.`);
if(atlas.frames.length!==expected)errors.push(`Atlas contains ${atlas.frames.length} metadata entries; expected ${expected}.`);
if(atlas.format!=="png+svg-atlas"||atlas.atlasSvg!=="researcher-atlas.svg"||atlas.atlasPng!=="researcher-atlas.png")errors.push("Atlas format/path mismatch.");
const pngPath=path.join(base,"researcher-atlas.png");
if(!fs.existsSync(pngPath))errors.push("Rasterized PNG atlas is missing.");
else {const png=fs.readFileSync(pngPath);if(png.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")errors.push("PNG atlas has invalid signature.");if(png.readUInt32BE(16)!==atlas.columns*atlas.frameWidth||png.readUInt32BE(20)!==atlas.rows*atlas.frameHeight)errors.push("PNG atlas dimensions do not match metadata.");}
if(!atlasSvg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'))errors.push("Packed atlas is not a valid SVG root.");
if(!atlasSvg.includes(`width="${atlas.columns*atlas.frameWidth}"`)||!atlasSvg.includes(`height="${atlas.rows*atlas.frameHeight}"`))errors.push("Packed atlas dimensions do not match metadata.");
const keys=new Set();
for(let i=0;i<atlas.frames.length;i++){
 const f=atlas.frames[i];
 const key=`${f.animation}/${f.direction}/${f.index}`;
 if(keys.has(key))errors.push(`Duplicate frame metadata: ${key}`);
 keys.add(key);
 if(f.atlasIndex!==i)errors.push(`Atlas index mismatch at ${key}.`);
 if(f.atlasX!==(i%atlas.columns)*atlas.frameWidth||f.atlasY!==Math.floor(i/atlas.columns)*atlas.frameHeight)errors.push(`Atlas coordinates mismatch at ${key}.`);
 if(!manifest.animations[f.animation])errors.push(`Unknown animation: ${f.animation}`);
 if(!manifest.directions.includes(f.direction))errors.push(`Unknown direction: ${f.direction}`);
 const file=path.join(base,f.file);
 if(!fs.existsSync(file))errors.push(`Missing frame file: ${f.file}`);
 else {
  const svg=fs.readFileSync(file,"utf8");
  if(!svg.startsWith("<svg")||!svg.includes('viewBox="0 0 128 128"')||!svg.endsWith("</svg>"))errors.push(`Invalid SVG structure: ${f.file}`);
  if(svg.includes("<image ")||svg.includes("<image>")||svg.includes("data:image/"))errors.push(`Embedded bitmap detected in procedural frame: ${f.file}`);
  if(!svg.includes('aria-label="Researcher '))errors.push(`Missing accessible frame label: ${f.file}`);
  if(f.width!==128||f.height!==128||f.pivotX!==64||f.pivotY!==116)errors.push(`Frame dimensions or pivot mismatch: ${f.file}`);
 }
}
for(const [animation,spec] of Object.entries(manifest.animations)){
 for(const direction of manifest.directions){
  for(let index=0;index<spec.count;index++){
   if(!keys.has(`${animation}/${direction}/${index}`))errors.push(`Missing indexed frame ${animation}/${direction}/${index}.`);
  }
 }
}
for(const state of Object.keys(manifest.animations)){
 if(!game.includes(`'${state}'`)&&!game.includes(`"${state}"`))errors.push(`Runtime does not reference animation state ${state}.`);
}
if(!game.includes("researcher-atlas.png")||!game.includes("ctx.drawImage(proceduralAtlas"))errors.push("Runtime PNG atlas renderer is not connected.");
if(errors.length){console.error("Procedural atlas validation failed:\\n- "+errors.join("\\n- "));process.exit(1);}
console.log(`Procedural atlas validation passed: ${expected} frames, ${Object.keys(manifest.animations).length} states, ${manifest.directions.length} directions; runtime atlas integration verified.`);
