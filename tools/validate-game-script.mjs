#!/usr/bin/env node
import fs from "node:fs";
import vm from "node:vm";

const htmlPath = "index.html";
const html = fs.readFileSync(htmlPath, "utf8");
const scripts = [...html.matchAll(/<script(?![^>]*\\bsrc=)(?![^>]*\\btype=["']module["'])[^>]*>([\\s\\S]*?)<\\/script>/gi)];
if (!scripts.length) {
  console.error("No inline game script found in index.html.");
  process.exit(1);
}
let checked = 0;
for (const match of scripts) {
  const source = match[1].trim();
  if (!source) continue;
  try {
    new vm.Script(source, { filename: htmlPath });
    checked++;
  } catch (error) {
    console.error(`Game script syntax error in ${htmlPath}: ${error.message}`);
    process.exit(1);
  }
}
if (!checked) {
  console.error("No non-empty inline game script was checked.");
  process.exit(1);
}
console.log(`Game script syntax valid: ${checked} inline script(s) checked.`);
