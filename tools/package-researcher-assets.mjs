#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=path.resolve("assets/characters/researcher/procedural");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"manifest.json"),"utf8"));
const frameRoot=path.join(root,"frames");
const entries=[];
for(const [animation,spec] of Object.entries(manifest.animations)){
  for(const direction of manifest.directions){
    for(let index=0;index<spec.count;index++){
      const filename=path.join("frames",animation,direction,String(index).padStart(2,"0")+".svg");
      const full=path.join(root,filename);
      if(!fs.existsSync(full)) throw new Error("Missing generated frame: "+filename);
      const svg=fs.readFileSync(full,"utf8");
      if(!svg.startsWith("<svg") || !svg.includes('viewBox="0 0 128 128"')) throw new Error("Invalid SVG frame: "+filename);
      entries.push({animation,direction,index,file:filename,width:128,height:128,pivotX:64,pivotY:116,fps:spec.fps,loop:spec.loop});
    }
  }
}
const expected=Object.values(manifest.animations).reduce((n,a)=>n+a.count*manifest.directions.length,0);
if(entries.length!==expected) throw new Error("Frame count mismatch: expected "+expected+", got "+entries.length);
const atlas={schemaVersion:1,characterId:"researcher",format:"svg-frames",frameWidth:128,frameHeight:128,pivotX:64,pivotY:116,directions:manifest.directions,animations:manifest.animations,frameCount:entries.length,frames:entries};
fs.writeFileSync(path.join(root,"researcher-atlas.json"),JSON.stringify(atlas,null,2)+"\n");
fs.writeFileSync(path.join(root,"BUILD-INFO.txt"),"GiftVerse procedural researcher source package\nFrames: "+entries.length+" SVG frames\nCanvas: 128x128, transparent background\nPivot: (64,116)\nPreview: preview.html\n\nThis is an initial procedural geometry pass, not final reference-matched art. Review silhouette, face, coat, equipment and animation before live game integration.\n");
console.log("Validated and indexed "+entries.length+" generated SVG frames.");
