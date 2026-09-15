/* ============================================================
   qPS4 · Service Worker
   ------------------------------------------------------------
   Estrategia:
   - "cache-first" para archivos propios (HTML, CSS, JS, iconos)
   - fallback a index.html para navegaciones offline
   ------------------------------------------------------------
   IMPORTANTE: cuando cambies cualquier archivo de la app,
   subí el número de versión de CACHE (por ejemplo qps4-v2)
   para forzar la actualización en el celular del usuario.
   ============================================================ */

const CACHE  = "qps4-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

/* ---------- Instalación: precachear todo ---------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ---------- Activación: borrar cachés viejas ---------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ---------- Fetch: cache-first con fallback ---------- */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((res) => {
          // Guardar copia en caché (solo respuestas válidas del mismo origen)
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, copy));
          }
          return res;
        })
        .catch(() => {
          // Fallback offline para navegaciones
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});