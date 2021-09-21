
// Resize the iFrame 

function updateParent() {
  
  var data = { height: document.querySelector('#app').clientHeight };
  
  var event = new CustomEvent('resourceLibraryIframeEvent', { detail: data })

  window.parent.document.dispatchEvent(event)
  
  window.requestAnimationFrame(updateParent);
}

updateParent();

// Send links up to the parent to be handled outside of the iFrame.

function interceptClickEvent(e) {
    var href;
    var target = e.target || e.srcElement;
    if (target.tagName === 'A') {
        href = target.getAttribute('href');

         e.preventDefault();
         
         var data = { link: href };
         var event = new CustomEvent('resourceLibraryIframeEvent', { detail: data })
        
         window.parent.document.dispatchEvent(event);
    }
}

if (document.addEventListener) {
    document.addEventListener('click', interceptClickEvent);
} else if (document.attachEvent) {
    document.attachEvent('onclick', interceptClickEvent);
}
