import fs from 'node:fs';
import path from 'node:path';
const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
let text='# Third-party notices\n\nGenerated from the installed lockfile. No external media assets or fonts are included. React, React DOM and Scheduler are the only shipped third-party runtime packages. All other packages are development/test/build tools.\n\n## Package inventory\n\n| Package | Version | Declared licence | Use |\n| --- | --- | --- | --- |\n';
const unknown=[];
for(const [p,info] of Object.entries(lock.packages)) {if(!p)continue;const file=path.join(p,'package.json');let pkg={};if(fs.existsSync(file))pkg=JSON.parse(fs.readFileSync(file,'utf8'));const name=pkg.name??p.replace(/^.*node_modules\//,'');const license=pkg.license??info.license??'UNAVAILABLE';if(license==='UNAVAILABLE')unknown.push(name);text+=`| ${name} | ${info.version} | ${typeof license==='string'?license:JSON.stringify(license)} | ${info.dev?'Development':'Runtime'} |\n`;}
text+='\n## Preservation\n\nInstalled dependency licence files remain under node_modules, restored by npm ci. The lockfile pins their distribution versions and integrity hashes. Development tools are not copied into the production site. The production notice below is also shipped at /THIRD_PARTY_LICENSES.txt. Regenerate this inventory after changing dependencies with node scripts/notices.mjs.\n\n';
let licenses='Jet Engine Playground — third-party runtime licences\n';
for(const name of ['react','react-dom','scheduler']) {const folder=path.join('node_modules',name);const file=fs.readdirSync(folder).find(n=>/^LICENSE(?:\.|$)/i.test(n));if(!file)throw Error(`Missing runtime licence: ${name}`);licenses+=`\n========== ${name} ==========\n${fs.readFileSync(path.join(folder,file),'utf8')}\n`;}
text+='## Runtime copyright and licence text\n\n```text\n'+licenses+'\n```\n';
text+='\n## Unresolved licence inventory entries\n\n'+(unknown.length?unknown.join(', '):'None. All lockfile packages declare a licence.')+'\n';
fs.writeFileSync('THIRD_PARTY_NOTICES.md',text);fs.writeFileSync('public/THIRD_PARTY_LICENSES.txt',licenses);console.log(`Recorded ${Object.keys(lock.packages).length-1} packages; ${unknown.length} unknown licence entries.`);
