

function updateParent() {
  
  var data = { height: document.querySelector('.content').clientHeight };
  
  var event = new CustomEvent('resourceLibraryIframeEvent', { detail: data })

  window.parent.document.dispatchEvent(event)
  
  window.requestAnimationFrame(updateParent);
}

updateParent();
