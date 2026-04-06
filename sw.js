const CACHE='yiju-v3';
const ASSETS=[
  '.','index.html','manifest.json','loader.js',
  'css/game.css',
  'js/audio.js','js/data.js','js/utils.js','js/components.js',
  'js/animations.js','js/minigames.js',
  'js/screens.js','js/screens1b.js',
  'js/screens2.js','js/screens2b.js','js/screens2c.js',
  'js/screens3.js','js/screens3b.js',
  'js/app.js'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

// Network-first: try network, fallback to cache
self.addEventListener('fetch',e=>{
  e.respondWith(
    fetch(e.request).then(r=>{
      const clone=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
