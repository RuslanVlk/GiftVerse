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
if(atlas.format!=="svg-atlas"||atlas.atlasSvg!=="researcher-atlas.svg")errors.push("Atlas format/path mismatch.");
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
 const file=path.join(base,f.file.replace(/^frames\//,"frames/"));
 if(!fs.existsSync(file))errors.push(`Missing frame file: ${f.file}`);
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
if(!game.includes("researcher-atlas.svg")||!game.includes("ctx.drawImage(proceduralAtlas"))errors.push("Runtime atlas renderer is not connected.");
if(errors.length){console.error("Procedural atlas validation failed:\\n- "+errors.join("\\n- "));process.exit(1);}
console.log(`Procedural atlas validation passed: ${expected} frames, ${Object.keys(manifest.animations).length} states, ${manifest.directions.length} directions; runtime atlas integration verified.`);
