document.getElementById('btnNewShot').addEventListener('click', function(e) {
  CaptShare.engine.capture();
});

document.getElementById('btnScreenShot').addEventListener('click', function(e) {
  CaptShare.engine.capture();
});

document.getElementById('btnCopyLink').addEventListener('click', function(e) {
  CaptShare.engine.copyLink();
});

chrome.app.window.current().onBoundsChanged.addListener(function() {
  CaptShare.engine.resizeCanvas();
});