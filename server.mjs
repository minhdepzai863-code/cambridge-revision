import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {gzip} from 'node:zlib';
import {promisify} from 'node:util';

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const appRoutes = new Set(['/','/login','/signup','/forgot-password','/reset-password','/dashboard','/workspace']);
const types = {
  '.html':'text/html; charset=utf-8', '.mjs':'text/javascript; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.woff2':'font/woff2',
  '.ttf':'font/ttf', '.webp':'image/webp', '.mp4':'video/mp4', '.pdf':'application/pdf',
  '.txt':'text/plain; charset=utf-8', '.xml':'application/xml; charset=utf-8'
};

const compress = promisify(gzip);
async function respond(res, status, type, body) {
  const headers = {
    'Content-Type':type, 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff'
  };
  if(Buffer.byteLength(body)>1024 && /^(text\/|image\/svg\+xml)/.test(type)){
    headers.Vary='Accept-Encoding';
    const acceptsGzip=(res.req.headers['accept-encoding']||'').split(',').some(value=>
      /^gzip(?:\s*;|\s*$)/i.test(value.trim())&&!/;\s*q=0(?:\.0*)?\s*$/i.test(value));
    if(acceptsGzip){
      body=await compress(body);
      headers['Content-Encoding']='gzip';
    }
  }
  res.writeHead(status,headers);
  res.end(body);
}

http.createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const route = pathname.replace(/\/$/, '') || '/';
    const path = appRoutes.has(route) ? (route==='/'?'/index.html':route+'.html') : pathname;
    const file = resolve(root, '.' + path);
    const type = types[extname(file)];
    if (!file.startsWith(root + sep) || path.includes('/.')) {
      await respond(res, 404, 'text/plain; charset=utf-8', 'Not found');
      return;
    }
    if (!type) throw new Error('Unknown path');
    const body = await readFile(file).catch(error=>{
      if(route!=='/'&&appRoutes.has(route)&&error.code==='ENOENT')return readFile(resolve(root,'index.html'));
      throw error;
    });
    await respond(res, path === '/404.html' ? 404 : 200, type, body);
  } catch {
    if (pathname && !extname(pathname)) {
      const fallback = await readFile(resolve(root, '404.html')).catch(() => null);
      if (fallback) {
        await respond(res, 404, types['.html'], fallback);
        return;
      }
    }
    await respond(res, 404, 'text/plain; charset=utf-8', 'Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Cambridge Revision: http://127.0.0.1:${port}`));
