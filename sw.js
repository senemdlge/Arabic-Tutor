/* Saudi Survival App — basit önbellek: dersler internetsiz de çalışsın */
const CACHE = "saudi-survival-v7";
const DOSYALAR = ["./", "./index.html", "./style.css?v=7", "./app.js?v=7", "./data.js?v=7", "./en.js?v=7", "./manifest.json", "./icon.svg", "./icon-180.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Çeviri API'si gibi dış istekler her zaman ağdan gitsin
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const kopya = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, kopya));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
