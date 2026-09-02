import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."),repo=path.resolve(root,"..","..","BSHandball"),outDir=path.join(root,"results","phase2","longitudinal");fs.mkdirSync(outDir,{recursive:true});
const milestones=[
  ["baseline","5962aac2"],
  ["phase1","b1c3b119"],
  ["phase2","720e308f"],
  ["phase3","55b094d8"],
  ["phase7","2584e77a"],
  ["performance","f467cca9"]
];
const git=(args,allow=false)=>{try{return execFileSync("git",["-C",repo,...args],{encoding:"utf8",maxBuffer:40_000_000}).trim();}catch(e){if(allow)return String(e.stdout||"").trim();throw e;}};
const directCount=commit=>{const files=git(["grep","-l","-E","from [\"']/dataLayer/|import\\([\"']/dataLayer/",commit,"--","src/public/presentationLayer/**/*.js"],true);return files?files.split("\n").filter(Boolean).length:0;};
const rows=milestones.map(([phase,commit])=>({phase,commit,date:git(["show","-s","--format=%aI",commit]),directPresentationDataImports:directCount(commit),filesChangedFromBaseline:Number(git(["diff","--name-only",milestones[0][1]+".."+commit]).split("\n").filter(Boolean).length||0),commitsFromBaseline:Number(git(["rev-list","--count",milestones[0][1]+".."+commit])||0)}));
const cols=Object.keys(rows[0]);fs.writeFileSync(path.join(outDir,"architecture-evolution.csv"),cols.join(",")+"\n"+rows.map(r=>cols.map(c=>r[c]).join(",")).join("\n")+"\n");
fs.writeFileSync(path.join(outDir,"architecture-evolution.json"),JSON.stringify({repository:"anonymized-system-a",method:"git object inspection at frozen milestones",rows},null,2));
console.log(JSON.stringify({rows:rows.length,output:path.relative(root,outDir),first:rows[0],last:rows.at(-1)},null,2));
