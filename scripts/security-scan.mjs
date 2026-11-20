import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const excluded=new Set(['node_modules','.git','test-results','playwright-report']);
const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bAKIA[0-9A-Z]{16}\b/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{30,}\b/,/\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,/(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][A-Za-z0-9_\-/+=]{20,}["']/i];
const matches=[];
function scanText(label,text){if(patterns.some(p=>p.test(text)))matches.push(label);}
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(excluded.has(entry.name))continue;const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(!/\.(png|jpg|ico|woff2?|tsbuildinfo)$/.test(file)){scanText(file,fs.readFileSync(file,'utf8'));}}}
walk('.');
let history='Unavailable: this workspace is not a Git repository.';
let isRepository=false;
try {execFileSync('git',['rev-parse','--is-inside-work-tree'],{stdio:'pipe'});isRepository=true;} catch {} 
if(isRepository) try {const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);for(const f of tracked){if(fs.existsSync(f))scanText(`tracked:${f}`,fs.readFileSync(f,'utf8'));}const commits=execFileSync('git',['rev-list','--all'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);for(const c of commits){const text=execFileSync('git',['show','--format=','--no-ext-diff',c],{encoding:'utf8',maxBuffer:50*1024*1024});scanText(`commit:${c}`,text);}history=`Checked ${tracked.length} tracked files and ${commits.length} available commits.`;}catch {history='Git history scan incomplete; a Git operation failed.';process.exitCode=1;}
const build=fs.existsSync('dist');
console.log(`Pattern-based credential scan: ${matches.length} flagged file/commit references. Secret values are never printed.`);
console.log(history);console.log(build?'Production output included in scan.':'Production output missing: build before final check.');
if(matches.length){console.log('Possible credential exposure detected. Review privately; if confirmed, revoke and rotate the credential. Deleting current content alone is insufficient.');process.exitCode=1;}
if(!build)process.exitCode=1;

