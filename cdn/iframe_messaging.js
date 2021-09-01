

function updateParent() {
  
  var data = { height: document.querySelector('#app').clientHeight };
  
  var event = new CustomEvent('resourceLibraryIframeEvent', { detail: data })

  window.parent.document.dispatchEvent(event)
  
  window.requestAnimationFrame(updateParent);
}

updateParent();
