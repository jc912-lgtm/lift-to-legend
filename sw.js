const CACHE='yiju-v1';
const ASSETS=[
  '.','index.html','manifest.json',
  'css/game.css',
  'js/audio.js','js/data.js','js/utils.js','js/components.js',
  'js/animations.js','js/minigames.js','js/screens.js','js/app.js',
  '阿神BGM.mp3'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
