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
const columns=10,rows=Math.ceil(entries.length/columns);
const cells=[];
for(let i=0;i<entries.length;i++){
  const entry=entries[i];
  const svg=fs.readFileSync(path.join(root,entry.file),"utf8");
  let inner=svg.slice(svg.indexOf(">")+1,svg.lastIndexOf("</svg>"));
  for(const id of ["coat","gold","orb","skin","glow"]){
    inner=inner.replaceAll('id="'+id+'"','id="'+id+"_"+i+'"').replaceAll("url(#"+id+")","url(#"+id+"_"+i+")");
  }
  cells.push('<svg x="'+(i%columns*128)+'" y="'+(Math.floor(i/columns)*128)+'" width="128" height="128" viewBox="0 0 128 128">'+inner+'</svg>');
}
const atlasSvg='<svg xmlns="http://www.w3.org/2000/svg" width="'+(columns*128)+'" height="'+(rows*128)+'" viewBox="0 0 '+(columns*128)+' '+(rows*128)+'">'+cells.join("")+'</svg>';
fs.writeFileSync(path.join(root,"researcher-atlas.svg"),atlasSvg);
const atlas={schemaVersion:1,characterId:"researcher",format:"svg-atlas",atlasSvg:"researcher-atlas.svg",columns,rows,frameWidth:128,frameHeight:128,pivotX:64,pivotY:116,directions:manifest.directions,animations:manifest.animations,frameCount:entries.length,frames:entries.map((e,i)=>({...e,atlasIndex:i,atlasX:(i%columns)*128,atlasY:Math.floor(i/columns)*128}))};
fs.writeFileSync(path.join(root,"researcher-atlas.json"),JSON.stringify(atlas,null,2)+"\n");
fs.writeFileSync(path.join(root,"BUILD-INFO.txt"),"GiftVerse procedural researcher source package\nFrames: "+entries.length+" SVG frames\nAtlas: researcher-atlas.svg ("+columns+" columns x "+rows+" rows)\nCanvas: 128x128, transparent background\nPivot: (64,116)\nPreview: preview.html\nRuntime: integrated into the playable GiftVerse HTML prototype\nArt status: procedural vector pass with costume, gear, book, face details and pose-specific motion; still requires visual review against the supplied reference before production sign-off.\n");
console.log("Validated and packed "+entries.length+" generated SVG frames into "+columns+"x"+rows+" atlas.");
