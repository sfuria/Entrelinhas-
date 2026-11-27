/* Entrelinhas 3.0.7: rede primeiro para arquivos públicos de interface; cache apenas como fallback offline. */
const CACHE = 'entrelinhas-app-shell-v472';
const ASSETS = ['./index.html','./manifest.json','./app-v400.js','./google-public-config.js','./pwa-register.js','./editor-next.html','./editor-next.css','./editor-next.js','./styles-v400.css','./icon-192.png','./icon-512.png','./assets/categorias/leitura.svg','./assets/categorias/todos.webp','./assets/categorias/ideia.webp','./assets/categorias/escaleta.webp','./assets/categorias/cena.webp','./assets/categorias/personagem.webp','./assets/categorias/mundo.webp','./assets/categorias/diario.webp','./assets/categorias/pesquisa.webp','./assets/categorias/cronologia.webp','./assets/decoracao/paisagem.svg','./assets/interface/projetos.webp','./assets/interface/ofensiva.webp','./assets/interface/meta.webp','./assets/interface/leitura.webp','./assets/interface/ia.webp','./assets/interface/aparencia.webp'];
const ROOT = new URL('./',self.location.href);
const KNOWN = new Set(ASSETS.map(p=>new URL(p,ROOT).pathname));
self.addEventListener('install', event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('entrelinhas-app-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 const navigation=req.mode==='navigate'&&url.pathname.startsWith(ROOT.pathname);
 if(!navigation&&!KNOWN.has(url.pathname))return;
 event.respondWith((async()=>{
  const shellUrl=navigation?new URL('./index.html',ROOT).href:req.url;
  try{
   const response=await fetch(req,{cache:'no-store'});
   if(response.ok){const c=await caches.open(CACHE);await c.put(shellUrl,response.clone());return response}
  }catch(_){/* offline */}
  const cached=await caches.match(shellUrl);
  return cached||new Response('Entrelinhas offline: conecte-se e abra novamente.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
 })());
});
