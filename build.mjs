import {mkdir,copyFile,cp,readFile,writeFile} from 'node:fs/promises';
import {join,relative} from 'node:path';
import {build,transform} from 'esbuild';
import {renderLanding} from './landing-content.mjs';
import {accountView} from './public-view.mjs';

const cssNames=['style','workspace','folder-library','academic-type','folio','revision-desk','dashboard','secondary','entry'];
const accounts=['login','signup','forgot-password','reset-password'];
const workspaces=['workspace','dashboard'];
const outputDir=process.argv[2]||'dist';
const output=file=>join(outputDir,file);
await mkdir(outputDir,{recursive:true});
await Promise.all(['404.html','robots.txt','sitemap.xml','favicon.svg','theme.js',
 ...cssNames.map(name=>name+'.css')].map(file=>copyFile(file,output(file))));
await cp('assets',output('assets'),{recursive:true,filter:path=>!/[\\/]covers(?:[\\/]|$)/.test(path)&&!path.endsWith('.json')&&!/[\\/](?:dm-sans|manrope|newsreader|open-sans)\.ttf$/.test(path)&&!/[\\/]fonts[\\/](?:newsreader|open-sans)\.woff2$/.test(path)&&!/[\\/]fonts[\\/](?:OFL|Manrope-OFL)\.txt$/.test(path)&&!/revision-books(?:-blue)?\.png$/.test(path)});
const [template,theme,...sheets]=await Promise.all(['index.html','theme.js',...cssNames.map(n=>n+'.css')].map(file=>readFile(file,'utf8')));
const minify=async (source,loader)=>(await transform(source,{loader,minify:true,target:'es2022'})).code;
const [css,appearance]=await Promise.all([minify(sheets.join('\n'),'css'),minify(theme,'js')]);
const shell=template
 .replace(/  <link rel="(?:stylesheet|modulepreload|preload)"[^>]*>\r?\n/g,'')
 .replace('<script src="/theme.js"></script>',()=>'<script>'+appearance+'</script>\n  <link rel="stylesheet" href="/revision.css">');
const escape=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const accountMetadata={
 login:['Log in','Open your Cambridge Revision account and continue with your saved papers and corrections.'],
 signup:['Create an account','Create a Cambridge Revision account to keep papers, marks and corrections together.'],
 'forgot-password':['Reset your password','Request a recovery link for your Cambridge Revision account.'],
 'reset-password':['Choose a new password','Choose a new password for your Cambridge Revision account.']
};
const privatePage=(html,route,description)=>html
 .replace('content="Track Cambridge AS and A Level past papers, scores and corrections in one revision workspace."',
   `content="${description}"`)
 .replace('<link rel="canonical" href="https://cambridge-revision.vercel.app/">',
   `<link rel="canonical" href="https://cambridge-revision.vercel.app/${route}">\n  <meta name="robots" content="noindex">`);
const page=(content,entry,title='Cambridge Revision')=>shell
 .replace(/<main id="main" class="loading">[\s\S]*?<\/main>/,()=>content)
 .replace('<title>Cambridge Revision</title>',()=>'<title>'+title+'</title>')
 .replace('src="/entry.mjs"',()=> 'src="/'+entry+'.mjs"');
const {metafile}=await build({entryPoints:['entry.mjs','app.mjs','store.mjs'],bundle:true,splitting:true,format:'esm',target:'es2022',minify:true,
 outdir:outputDir,outExtension:{'.js':'.mjs'},chunkNames:'chunks/[name]-[hash]',metafile:true});
const imports=new Set();
function collect(file){
 for(const dependency of metafile.outputs[file]?.imports||[]){
  if(dependency.external||dependency.kind!=='import-statement'||imports.has(dependency.path))continue;
  imports.add(dependency.path);
  collect(dependency.path);
 }
}
collect(Object.keys(metafile.outputs).find(file=>metafile.outputs[file].entryPoint==='app.mjs'));
const workspaceShell=shell.replace('src="/entry.mjs"','src="/app.mjs"')
 .replace(/<style id="entry-motion">[^<]*<\/style>/,'')
 .replace('</head>',[...imports].map(path=>`  <link rel="modulepreload" href="/${relative(outputDir,path).replaceAll('\\','/')}" fetchpriority="low">`).join('\n')+'\n</head>');
await Promise.all([
 writeFile(output('revision.css'),css),
 writeFile(output('index.html'),page(renderLanding(false),'entry')),
 ...accounts.map(route=>{
   const [title,description]=accountMetadata[route];
   return writeFile(output(route+'.html'),privatePage(page(accountView('/'+route,escape),'entry',title+' · Cambridge Revision'),route,description));
 }),
 ...workspaces.map(route=>writeFile(output(route+'.html'),privatePage(workspaceShell,route,
   'Open your Cambridge Revision workspace to track papers, topics and corrections.')))
]);
console.log('Static production build ready in '+outputDir);
