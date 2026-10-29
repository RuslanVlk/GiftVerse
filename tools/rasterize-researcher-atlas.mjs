#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const root=path.resolve("assets/characters/researcher/procedural");
const svgPath=path.join(root,"researcher-atlas.svg");
const jsonPath=path.join(root,"researcher-atlas.json");
const pngPath=path.join(root,"researcher-atlas.png");
const atlas=JSON.parse(fs.readFileSync(jsonPath,"utf8"));
const svg=fs.readFileSync(svgPath,"utf8");
const renderer=new Resvg(svg,{fitTo:{mode:"original"},font:{loadSystemFonts:false}});
const png=renderer.render().asPng();
if(png.length<1000||png.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw new Error("Rasterizer did not produce a valid PNG.");
const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
if(width!==atlas.columns*atlas.frameWidth||height!==atlas.rows*atlas.frameHeight)throw new Error(`PNG dimensions ${width}x${height} do not match atlas metadata.`);
fs.writeFileSync(pngPath,png);
atlas.format="png+svg-atlas";
atlas.atlasPng="researcher-atlas.png";
atlas.pngWidth=width;
atlas.pngHeight=height;
fs.writeFileSync(jsonPath,JSON.stringify(atlas,null,2)+"\n");
console.log(`Rasterized researcher atlas to PNG: ${width}x${height}, ${png.length} bytes.`);
