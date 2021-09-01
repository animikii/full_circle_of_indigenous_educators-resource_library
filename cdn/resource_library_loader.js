
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
  doc.write('<html><body><div class="content"><div id="app"></div></div><link rel="stylesheet" href="https://fcie.editmy.website/stylesheets/index_css.css"><script type="module" src="https://fcie.editmy.website/javascripts/index_js.js"></script><script type="module" src="https://fcie.editmy.website/javascripts/iframe_messaging.js"></script></body></html>')
  doc.close();
  
})();