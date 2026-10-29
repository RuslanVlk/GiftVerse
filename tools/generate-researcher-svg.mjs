#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("assets/characters/researcher/procedural");
fs.mkdirSync(OUT, { recursive: true });
const W=128,H=128;
const palettes={ink:"#101521",coat:"#172642",coat2:"#223c61",blue:"#2769cf",cyan:"#55e9ff",gold:"#e4b65f",skin:"#efc6a0",hair:"#111521",hair2:"#293047",boot:"#171b29",leather:"#4d302b",light:"#a8dff8"};
function esc(s){return s.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
function svgWrap(body,label){return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}"><defs><linearGradient id="coat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palettes.coat2}"/><stop offset=".58" stop-color="${palettes.coat}"/><stop offset="1" stop-color="#090f1b"/></linearGradient><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0b2"/><stop offset=".45" stop-color="${palettes.gold}"/><stop offset="1" stop-color="#80512c"/></linearGradient><radialGradient id="orb"><stop stop-color="#f0ffff"/><stop offset=".25" stop-color="${palettes.cyan}"/><stop offset=".7" stop-color="${palettes.blue}"/><stop offset="1" stop-color="#18366e"/></radialGradient><linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe0bd"/><stop offset="1" stop-color="${palettes.skin}"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="2.1" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${body}</svg>`}
function buildFrame({direction="down",pose="idle",frame=0}={}){
 const moving=["walk","run"].includes(pose), phase=frame/(pose==="run"?8:8)*Math.PI*2, stride=moving?Math.sin(phase)*(pose==="run"?7:4):0;
 const bob=pose==="idle"?Math.sin(frame/6*Math.PI*2)*.7:moving?Math.abs(Math.sin(phase))*1.5:0;
 const side=direction==="left"||direction==="right", back=direction==="up", flip=direction==="right";
 const arm=pose==="attack"?Math.sin(frame/7*Math.PI)*9:pose==="interact"?-6:0;
 const cast=pose==="echoCast";
 const hit=pose==="hit";
 const crouch=pose==="interact"?3:0;
 const cx=64, headY=24+bob, torsoY=40+bob+crouch;
 const skin=palettes.skin, coat="url(#coat)";
 let legs,arms,head;
 if(back){
   legs=`<path d="M49 75 L48 ${97+stride} L43 ${111+stride} L52 ${113+stride} L61 91 L67 78 Z" fill="#101522" stroke="#b28b56" stroke-width="1.2"/><path d="M67 78 L75 ${96-stride} L76 ${111-stride} L85 ${112-stride} L84 95 L78 73 Z" fill="#101522" stroke="#b28b56" stroke-width="1.2"/>`;
   arms=`<path d="M45 43 Q36 51 40 70 L45 75 L51 68 L51 51 Z" fill="${coat}" stroke="#c59b58" stroke-width="1.3"/><path d="M78 43 Q89 52 85 69 L80 74 L74 67 L73 51 Z" fill="${coat}" stroke="#c59b58" stroke-width="1.3"/>`;
   head=`<path d="M49 15 Q51 4 64 5 Q79 5 80 18 L75 31 L53 31 Z" fill="${palettes.hair}" stroke="#414960" stroke-width="1.4"/><path d="M53 29 L50 41 L64 47 L78 40 L75 28 L70 35 L59 35 Z" fill="#16365a" stroke="${palettes.gold}" stroke-width="1.1"/>`;
 } else if(side){
   legs=`<path d="M55 74 L53 ${94+stride} L48 ${109+stride} L57 ${112+stride} L65 91 L66 75 Z" fill="#101522" stroke="#b28b56" stroke-width="1.2"/><path d="M65 76 L70 ${96-stride} L69 ${111-stride} L79 ${112-stride} L79 94 L74 74 Z" fill="#151a28" stroke="#b28b56" stroke-width="1.2"/>`;
   arms=`<path d="M58 42 Q49 49 53 69 L59 73 L64 66 L64 49 Z" fill="${coat}" stroke="#c59b58" stroke-width="1.3"/><path d="M70 43 Q80 48 77 62 L73 69 L67 65 L67 50 Z" fill="${coat}" stroke="#c59b58" stroke-width="1.3"/>`;
   head=`<path d="M52 15 Q53 4 65 6 Q79 8 78 20 L73 30 L61 32 L54 25 Z" fill="${palettes.hair}" stroke="#414960" stroke-width="1.4"/><path d="M72 22 L81 27 L72 31 Z" fill="${skin}" stroke="#c08d69" stroke-width=".7"/><path d="M54 23 Q60 16 69 20 L70 28 L58 31 Z" fill="${skin}"/><path d="M53 15 Q63 5 74 16 L69 22 L59 20 L55 27 Z" fill="${palettes.hair}"/>`;
 } else {
   legs=`<path d="M49 74 L48 ${96+stride} L44 ${109+stride} Q49 ${114+stride} 58 ${111+stride} L62 92 L64 76 Z" fill="#101522" stroke="#b28b56" stroke-width="1.2"/><path d="M64 76 L67 ${94-stride} L72 ${109-stride} Q78 ${114-stride} 85 ${111-stride} L79 95 L77 74 Z" fill="#151a28" stroke="#b28b56" stroke-width="1.2"/><path d="M43 ${109+stride} L58 ${110+stride} L61 ${115+stride} Q51 ${118+stride} 40 ${115+stride} Z M71 ${109-stride} L85 ${109-stride} L91 ${115-stride} Q80 ${118-stride} 69 ${115-stride} Z" fill="#090e18" stroke="#d4aa65" stroke-width="1"/>`;
   arms=`<path d="M48 41 Q38 45 38 61 L34 75 Q38 80 43 75 L50 58 Z" fill="${coat}" stroke="#c59b58" stroke-width="1.4"/><path d="M78 41 Q88 45 88 60 L92 72 Q88 78 83 73 L76 57 Z" fill="${coat}" stroke="#c59b58" stroke-width="1.4"/>`;
   head=`<path d="M48 14 Q51 4 64 5 Q78 5 80 16 L78 29 Q73 38 64 38 Q53 37 49 28 Z" fill="url(#skin)" stroke="#c08d69" stroke-width=".9"/><path d="M47 20 Q42 9 54 6 L60 2 L63 7 L73 5 L82 16 L78 22 L73 15 L67 18 L59 14 L54 25 L50 20 L49 31 L45 27 Z" fill="${palettes.hair}" stroke="#394258" stroke-width="1"/><path d="M53 24 L61 24 M69 24 L75 23" stroke="#243d65" stroke-width="1.5"/><path d="M62 31 Q66 33 70 30" fill="none" stroke="#9d5e54" stroke-width=".8"/>`;
 }
 const coatBody=back
 ? `<path d="M49 36 L78 36 L85 66 L91 88 L76 96 L64 85 L52 96 L37 88 L44 64 Z" fill="${coat}" stroke="url(#gold)" stroke-width="1.8"/><path d="M49 43 L64 57 L78 43 L74 79 L64 87 L54 79 Z" fill="#25466c" stroke="#b88949" stroke-width="1.2"/><path d="M49 48 L78 48 M48 56 L78 56 M50 64 L76 64" stroke="#bf9857" stroke-width="1"/><path d="M54 41 L64 52 L74 41" fill="none" stroke="#4e91d5" stroke-width="2"/>`
 : `<path d="M51 35 L76 35 L82 45 L80 63 L91 88 L77 96 L64 85 L51 96 L37 88 L48 63 L45 45 Z" fill="${coat}" stroke="url(#gold)" stroke-width="1.8"/><path d="M51 39 L64 51 L76 39 L72 67 L64 78 L56 67 Z" fill="#101b2d" stroke="#4e78b8" stroke-width="1.1"/><path d="M48 49 L55 52 L51 78 L42 87 L48 61 Z M78 49 L73 52 L77 78 L86 87 L80 61 Z" fill="#244d7d" stroke="#d6ad63" stroke-width="1"/><path d="M56 40 L64 51 L72 40" fill="none" stroke="#dcb566" stroke-width="2"/><path d="M58 53 L70 53 L69 71 L64 76 L59 71 Z" fill="#101523" stroke="#c8a15e" stroke-width="1"/><path d="M53 46 L57 69 L51 83 M75 46 L71 69 L77 83" fill="none" stroke="#dfb65f" stroke-width="1.8"/><path d="M47 53 L81 53" stroke="#a47b47" stroke-width="1.3"/>`;
 const cape=back
 ? `<path d="M48 37 Q64 42 80 37 L91 83 Q80 ${91+Math.sin(phase)*2} 75 92 L64 84 L52 93 Q42 ${91-Math.sin(phase)*2} 36 84 Z" fill="#101b31" stroke="#4c8bd0" stroke-width="1.5"/><path d="M43 81 L53 88 L64 81 L75 88 L85 81" fill="none" stroke="#d8b064" stroke-width="1.2"/><path d="M50 47 L64 59 L78 47" fill="none" stroke="#2f5d91" stroke-width="2"/>`
 : `<path d="M49 38 Q64 43 79 38 L88 83 Q79 ${91+Math.sin(phase)*2} 74 92 L64 84 L54 92 Q43 ${91-Math.sin(phase)*2} 39 83 Z" fill="#101b31" stroke="#386da9" stroke-width="1.2"/><path d="M44 81 L54 87 L64 80 L74 87 L84 81" fill="none" stroke="#b58a4d" stroke-width="1"/>`;
 const tailoring=back
 ? `<path d="M46 43 L64 60 L82 43 M64 60 L64 84" fill="none" stroke="#4c8dce" stroke-width="2.2"/><path d="M43 87 L54 91 L64 84 L75 91 L86 87" fill="none" stroke="#e4b65f" stroke-width="1.2"/><path d="M48 67 L57 72 M80 67 L71 72" stroke="#0a1220" stroke-width="2.4"/>`
 : `<path d="M47 44 L57 51 L51 70 L43 85 M81 44 L71 51 L77 70 L85 85" fill="none" stroke="#0a1425" stroke-width="3.1"/><path d="M47 44 L57 51 L51 70 L43 85 M81 44 L71 51 L77 70 L85 85" fill="none" stroke="#d4ad63" stroke-width=".9"/><path d="M54 54 L59 58 L55 74 L49 80 M74 54 L69 58 L73 74 L79 80" fill="none" stroke="#5b9de1" stroke-width="1.2"/><path d="M54 83 L64 88 L74 83" fill="none" stroke="#e8c77b" stroke-width="1.6"/><rect x="60" y="80" width="8" height="7" rx="1" fill="#101522" stroke="#e7c578" stroke-width="1"/><circle cx="64" cy="83.5" r="1.4" fill="#69eaff"/>`;
 const equipment=`<path d="M42 47 Q36 49 36 58 L38 69 L45 70 L48 58 Z" fill="#213b5d" stroke="#d7b46c" stroke-width="1.1"/><path d="M39 53 L44 55 L42 64" fill="none" stroke="#5799d9" stroke-width="1.3"/><path d="M81 47 Q88 49 88 58 L86 69 L79 70 L76 58 Z" fill="#172944" stroke="#d7b46c" stroke-width="1.1"/><path d="M80 54 L85 56 L83 64" fill="none" stroke="#5799d9" stroke-width="1.3"/><path d="M50 69 L58 72 L56 78 L48 76 Z M70 72 L78 69 L80 76 L72 78 Z" fill="#111a2a" stroke="#bc9558" stroke-width=".9"/><path d="M51 92 L60 95 L58 104 L49 105 Z M68 95 L77 92 L79 105 L70 104 Z" fill="#202d44" stroke="#b58d53" stroke-width="1"/><path d="M49 108 L57 109 M71 109 L79 108" stroke="#64dff4" stroke-width="1.2"/>`;
 const book=`<g transform="rotate(-12 42 65)"><path d="M32 56 Q39 53 44 57 L44 72 Q38 69 32 73 Z" fill="#6b3e31" stroke="#e4b65f" stroke-width="1.1"/><path d="M44 57 Q49 54 54 57 L54 72 Q49 69 44 72 Z" fill="#27466b" stroke="#e4b65f" stroke-width="1.1"/><path d="M36 60 L41 60 M36 63 L41 63 M47 60 L51 60 M47 63 L51 63" stroke="#f3d28a" stroke-width=".7"/></g>`;
 const bag=`<path d="M76 43 Q88 41 89 53 L88 68 L77 71 L74 53 Z" fill="#49352f" stroke="#d2a75e" stroke-width="1.3"/><path d="M77 49 L87 49 M78 56 L86 56" stroke="#d9b16a" stroke-width="1.2"/><rect x="80" y="59" width="5" height="5" rx="1" fill="#172b48" stroke="#d7b46c" stroke-width=".8"/>`;
 const hairDetails=back
 ? `<path d="M50 14 L57 8 L61 12 L67 5 L73 10 L79 15 M53 17 L59 12 M65 13 L71 8 M72 18 L77 14" fill="none" stroke="#46516c" stroke-width="1.1" stroke-linecap="round"/><path d="M54 10 L60 7 M68 9 L72 11" fill="none" stroke="#7890b7" stroke-width=".7" opacity=".8"/>`
 : side
 ? `<path d="M52 15 L58 8 L63 11 L68 5 L75 10 L79 17 M55 17 L61 12 M66 13 L72 9 M70 18 L77 14" fill="none" stroke="#46516c" stroke-width="1.1" stroke-linecap="round"/><path d="M59 9 L63 8 M69 10 L73 12" fill="none" stroke="#7890b7" stroke-width=".7" opacity=".8"/>`
 : `<path d="M47 18 L51 9 L58 5 L61 9 L66 3 L72 6 L78 10 L82 18 M49 17 L55 10 L59 12 M61 8 L64 13 M68 7 L73 12 M76 12 L79 18 M52 20 L56 15 L58 20 M64 15 L68 11 L70 18 M74 17 L77 21" fill="none" stroke="#46516c" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/><path d="M54 8 L59 6 M66 6 L70 8 M74 10 L77 13" fill="none" stroke="#7e8db0" stroke-width=".75" opacity=".85"/>`;
 const armorDetails=`<path d="M45 43 Q39 41 36 47 L39 55 L48 53 Z M80 43 Q86 41 89 47 L86 55 L77 53 Z" fill="#2b4162" stroke="#dcb36b" stroke-width="1.2"/><path d="M39 47 L44 46 L46 50 L41 52 Z M81 46 L86 47 L84 52 L79 50 Z" fill="#101b2e" stroke="#5688bd" stroke-width=".8"/><circle cx="42" cy="47" r="1.1" fill="#f4d38d"/><circle cx="84" cy="47" r="1.1" fill="#f4d38d"/><path d="M49 57 L53 60 M79 57 L75 60 M49 74 L45 79 M79 74 L83 79" stroke="#80b5e8" stroke-width=".8"/>`;
 const posedArms=pose==="attack"
 ? `<g transform="rotate(${frame<3?-16:frame<6?24:-7} 64 48)">${arms}<path d="M40 58 L34 65 M86 56 L94 62" stroke="#e4b65f" stroke-width="1.1" fill="none"/></g>`
 : pose==="echoCast"
 ? `<g transform="rotate(-10 64 48)">${arms}<path d="M40 58 Q43 48 51 47 M88 58 Q85 48 77 47" stroke="#72eaff" stroke-width="1.3" fill="none"/></g>`
 : pose==="interact"
 ? `<g transform="rotate(-7 64 48)">${arms}<path d="M84 61 L91 59 L93 63" stroke="#e4b65f" stroke-width="1.2" fill="none"/></g>`
 : `<g transform="rotate(${moving?Math.sin(phase+Math.PI)*11:0} 64 48)">${arms}</g>`;
 const orb=cast
 ? `<g filter="url(#glow)"><circle cx="${flip?38:89}" cy="48" r="${8+Math.sin(frame)*1.4}" fill="url(#orb)" stroke="#a5f7ff" stroke-width="1.4"/><path d="M${flip?28:79} 48 Q${flip?38:89} 29 ${flip?48:99} 48 Q${flip?38:89} 67 ${flip?28:79} 48" fill="none" stroke="#b6faff" stroke-width="1.2"/><path d="M${flip?25:76} 48 L${flip?51:102} 48 M${flip?38:89} 35 L${flip?38:89} 61" stroke="#e2ffff" stroke-width=".8"/></g>`
 : `<g filter="url(#glow)"><circle cx="${flip?39:89}" cy="48" r="7" fill="url(#orb)" stroke="#a5f7ff" stroke-width="1.2"/><path d="M${flip?34:84} 48 L${flip?39:89} 40 L${flip?44:94} 48 L${flip?39:89} 56 Z" fill="#e2ffff"/></g>`;
 let body= `<g transform="translate(0 ${bob})">${cape}${legs}<path d="M47 40 L82 40 L84 71 L79 86 L64 91 L49 86 L44 71 Z" fill="${coat}" stroke="#c49a5a" stroke-width="1.4"/>${coatBody}${tailoring}${equipment}${armorDetails}${posedArms}<path d="M47 42 L56 47 L52 58 L45 55 Z M80 42 L72 47 L76 58 L83 55 Z" fill="#121b2b" stroke="#d4ae66" stroke-width="1"/>${bag}${direction==="down"?book:""}<path d="M52 41 L76 41 L73 48 L64 54 L55 48 Z" fill="#17395e" stroke="#d8b064" stroke-width="1.2"/><path d="M58 47 L64 53 L70 47" fill="none" stroke="#e6c77d" stroke-width="1.5"/><path d="M50 58 L78 58 M52 65 L76 65" stroke="#d4ad63" stroke-width="1.2"/><rect x="61" y="58" width="7" height="8" rx="1" fill="#273c58" stroke="#e5c277" stroke-width="1"/>${head}${hairDetails}${!back&&!side?`<path d="M52 22 Q56 20 60 22 M68 22 Q72 20 76 22" fill="none" stroke="#17213a" stroke-width="1.8"/><circle cx="57" cy="23" r="1" fill="#8ceeff"/><circle cx="72" cy="23" r="1" fill="#8ceeff"/><path d="M61 31 L64 32 L67 31" fill="none" stroke="#b97d70" stroke-width=".7"/>`:""}<path d="M51 28 Q64 39 77 28 L75 36 L64 43 L53 36 Z" fill="#17395e" stroke="#d6ad65" stroke-width="1.2"/>${orb}${cast?`<g fill="none" stroke="#74e8ff" stroke-width="1.3" opacity=".9"><circle cx="${flip?39:89}" cy="48" r="${15+frame*2}"/><circle cx="${flip?39:89}" cy="48" r="${8+frame}" opacity=".65"/></g>`:""}${pose==="attack"?`<path d="M${flip?28:83} 44 Q${flip?15:108} 29 ${flip?22:100} 17" fill="none" stroke="#9cefff" stroke-width="2.3" filter="url(#glow)"/>`:""}${hit?`<path d="M38 28 L45 37 L39 42 L49 47 L43 53" fill="none" stroke="#ff6b7b" stroke-width="2.2"/>`:""}</g>`;
 if(flip) body=`<g transform="translate(128 0) scale(-1 1)">${body}</g>`;
 if(pose==="interact") body=`<g transform="translate(0 3)">${body}</g>`;
 if(pose==="attack") body=`<g transform="translate(${flip?-arm:arm} 0)"><g transform="rotate(${frame<3?-2:frame<6?4:0} 64 76)">${body}</g></g>`;
 if(pose==="hit") body=`<g transform="translate(${frame%2?2:-2} 0)">${body}</g>`;
 if(pose==="death") body=`<g opacity="${Math.max(.38,1-frame*.07)}" transform="translate(64 78) rotate(${frame*8}) translate(-64 -78)">${body}</g>`;
 if(pose==="menuEnter") body=`<g opacity="${Math.min(1,.35+frame*.1)}">${body}<g fill="none" stroke="#72eaff" stroke-width="1.3" opacity="${Math.min(.9,.25+frame*.09)}"><ellipse cx="64" cy="112" rx="${22+frame*2}" ry="${5+frame*.35}"/><path d="M64 106 L64 ${78-frame*2} M49 104 L43 ${91-frame} M79 104 L85 ${91-frame}"/></g></g>`;
 const shadow=`<ellipse cx="64" cy="116" rx="19" ry="4" fill="#000" opacity=".18"/>`;
 return svgWrap(shadow+body,`Researcher ${direction} ${pose} frame ${frame}`);
}
const specs={idle:{count:6,fps:6,loop:true},walk:{count:8,fps:10,loop:true},run:{count:8,fps:12,loop:true},attack:{count:8,fps:12,loop:false},echoCast:{count:10,fps:10,loop:false},interact:{count:6,fps:8,loop:false},menuEnter:{count:8,fps:10,loop:false},hit:{count:4,fps:12,loop:false},death:{count:8,fps:8,loop:false}};
const directions=["down","left","right","up"];
for(const direction of directions)for(const [pose,spec] of Object.entries(specs))for(let frame=0;frame<spec.count;frame++){
 const file=path.join(OUT,"frames",pose,direction,`${String(frame).padStart(2,"0")}.svg`);
 fs.mkdirSync(path.dirname(file),{recursive:true});
 fs.writeFileSync(file,buildFrame({direction,pose,frame}));
}
const manifest={schemaVersion:1,characterId:"researcher",source:"procedural SVG geometry; not extracted from reference images",referencePolicy:"Use user-supplied reference as design authority; revise SVG paths and proportions against it.",frameWidth:W,frameHeight:H,pivot:{x:64,y:116},directions,animations:specs,frames:Object.fromEntries(Object.entries(specs).map(([k,v])=>[k,v.count*directions.length])),totalFrames:Object.values(specs).reduce((n,s)=>n+s.count*directions.length,0),exportNotes:"SVG frames are generated locally. For PNG atlases use a rasterizer such as resvg or sharp; no external image is embedded."};
fs.writeFileSync(path.join(OUT,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
console.log(`Generated ${manifest.totalFrames} procedural SVG frames in ${OUT}`);
