const CACHE_NAME = "aaradhya-cache-v3";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener("fetch", event=>{

  // Cache Google Sheet API response
  if(event.request.url.includes("docs.google.com")){
    event.respondWith(
      caches.open(CACHE_NAME).then(cache=>
        fetch(event.request)
          .then(res=>{
            cache.put(event.request,res.clone());
            return res;
          })
          .catch(()=>cache.match(event.request))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res=>res||fetch(event.request))
  );
});
