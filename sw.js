const CACHE_NAME = 'nota-de-compras-v1';
const ARQUIVOS_PARA_CACHE = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
 
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHE))
  );
  self.skipWaiting();
});
 
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});
 
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((resposta) => {
      if (resposta) return resposta;
      return fetch(event.request)
        .then((rede) => {
          const copia = rede.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          return rede;
        })
        .catch(() => resposta);
    })
  );
});
 


