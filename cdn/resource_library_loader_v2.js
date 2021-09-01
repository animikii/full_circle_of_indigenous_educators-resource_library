
/* The resource library code doesn't cleanly inject into the partners word press, moving the library into a Shadow dom to avoid script/style conflicts. */

(function() {
  
  if(!document.querySelector("#app")) {
    return;
  }
    
  const iframe = document.createElement('iframe');
  
  var app = document.querySelector("#app");
  app.appendChild(iframe);
  
  function handleResourceLibraryIframeEvent(e) {
    iframe.style.height = `${e.detail.height + 32}px`;
  }
  
  window.document.addEventListener('resourceLibraryIframeEvent', handleResourceLibraryIframeEvent, false);
  
  const doc = document.querySelector('iframe').contentWindow.document;
  doc.open();
  doc.write('<html><body><div class="content"><div id="app"></div></div><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JonCSGuy/Full-Circle-of-Indigenous-Educators-Resource-Library@master/cdn/resource_library.css"><script type="module" src="https://cdn.jsdelivr.net/gh/JonCSGuy/Full-Circle-of-Indigenous-Educators-Resource-Library@17c21e2b1ac756fb74b45934de1ec3b7b6b67b49/cdn/resource_library.js"></script><script type="module" src="https://cdn.jsdelivr.net/gh/JonCSGuy/Full-Circle-of-Indigenous-Educators-Resource-Library@master/cdn/iframe_messaging.js"></script></body></html>')
  doc.close();
  
})();
