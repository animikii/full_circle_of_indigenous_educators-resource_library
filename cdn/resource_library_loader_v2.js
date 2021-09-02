
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
  doc.write('<html><body><div class="content"><div id="app"></div></div><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/animikii/full_circle_of_indigenous_educators-resource_library@dae572c4f9791cea7e38eb1d9a45e72f9418f356/cdn/resource_library.css"><script type="module" src="https://cdn.jsdelivr.net/gh/animikii/full_circle_of_indigenous_educators-resource_library@dae572c4f9791cea7e38eb1d9a45e72f9418f356/cdn/resource_library.js"></script><script type="module" src="https://cdn.jsdelivr.net/gh/animikii/full_circle_of_indigenous_educators-resource_library@ec6a57ae7187fdbda43085ef70d9597145ec6dc5/cdn/iframe_messaging.js"></script></body></html>')
  doc.close();
  
})();
