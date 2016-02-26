document.getElementById('btnNewShot').addEventListener('click', function(e) {
  CaptShare.engine.capture();
});

document.getElementById('btnScreenShot').addEventListener('click', function(e) {
  CaptShare.engine.capture();
});

document.getElementById('btnCopyLink').addEventListener('click', function(e) {
  CaptShare.engine.copyLink();
});

document.getElementById('btnUpload').addEventListener('click', function(e) {
  CaptShare.engine.upload();
});

document.getElementById('btnHelp').addEventListener('click', function(e) {
  showModal('help');
});

document.getElementById('btnCloseSettings').addEventListener('click', function(e) {
  closeModal('settings');
});

document.getElementById('btnCloseHelp').addEventListener('click', function(e) {
  closeModal('help');
});

document.getElementById('btnSettings').addEventListener('click', function(e) {
  showModal('settings');
});

chrome.app.window.current().onBoundsChanged.addListener(function() {
  CaptShare.engine.resizeCanvas();
});