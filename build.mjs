import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const f of ['index.html','theme.js','app.mjs','store.mjs','domain.mjs','syllabus.mjs','charts.mjs','config.mjs','style.css','favicon.svg'])await copyFile(f,`dist/${f}`);
await cp('assets','dist/assets',{recursive:true});
console.log('Static production build ready in dist/');
