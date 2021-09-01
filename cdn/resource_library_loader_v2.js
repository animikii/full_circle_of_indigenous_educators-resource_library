
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
  doc.write('<html><body><div class="content"><div id="app"></div></div><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JonCSGuy/Full-Circle-of-Indigenous-Educators-Resource-Library@3e521710c0c98638ab5f79740e700be713a6e9f3/cdn/resource_library.css"><script type="module" src="https://cdn.jsdelivr.net/gh/JonCSGuy/Full-Circle-of-Indigenous-Educators-Resource-Library@43938c223d5272086b180878b4727af5be2fdd64/cdn/resource_library.js"></script><script type="module" src="https://cdn.jsdelivr.net/gh/JonCSGuy/Full-Circle-of-Indigenous-Educators-Resource-Library@master/cdn/iframe_messaging.js"></script></body></html>')
  doc.close();
  
})();
