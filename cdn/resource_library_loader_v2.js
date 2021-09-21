
/* The resource library code doesn't cleanly inject into the partners word press, moving the library into a Shadow dom to avoid script/style conflicts. */

(function() {
  
  if(!document.querySelector("#app")) {
    return;
  }
    
  const iframe = document.createElement('iframe');
  
  var app = document.querySelector("#app");
  app.appendChild(iframe);

  function handleResourceLibraryIframeEvent(e) {
    if(e.detail.height) {
      iframe.style.height = `${e.detail.height + 32}px`;
    }
    if(e.detail.link) {
      window.location = e.detail.link;
    }
  }
  
  window.document.addEventListener('resourceLibraryIframeEvent', handleResourceLibraryIframeEvent, false);

  function handleResourceLibraryIframeScrollEvent(e) {
    window.scrollTo(0, 0);
  }

  window.document.addEventListener('resourceLibraryIframeScrollEvent', handleResourceLibraryIframeScrollEvent, false);

  
  const doc = document.querySelector('iframe').contentWindow.document;
  doc.open();
  doc.write('<html><body><div class="content"><div id="app"></div></div><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/animikii/full_circle_of_indigenous_educators-resource_library@dae572c4f9791cea7e38eb1d9a45e72f9418f356/cdn/resource_library.css"><script type="module" src="https://cdn.jsdelivr.net/gh/animikii/full_circle_of_indigenous_educators-resource_library@a4de197e897dd4e2bc44441344322a5df007f5e0/cdn/resource_library.js"></script><script type="module" src="https://cdn.jsdelivr.net/gh/animikii/full_circle_of_indigenous_educators-resource_library@a8b481851bae2f2a5b5444db90221a78ef8d602d/cdn/iframe_messaging.js"></script></body></html>')
  doc.close();
  
})();
