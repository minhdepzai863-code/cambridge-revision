import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const f of ['index.html','theme.js','app.mjs','workspace-view.mjs','workspace.css','store.mjs','backup.mjs','domain.mjs','syllabus.mjs','stem-syllabuses.mjs','charts.mjs','config.mjs','style.css','favicon.svg'])await copyFile(f,`dist/${f}`);
await cp('assets','dist/assets',{recursive:true,filter:path=>!/[\\/]covers(?:[\\/]|$)/.test(path)&&!path.endsWith('.json')&&!/revision-books(?:-blue)?\.png$/.test(path)});
console.log('Static production build ready in dist/');
