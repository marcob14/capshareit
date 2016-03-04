document.getElementById('btnNewShot').addEventListener('click', function(e) {
  CaptShare.engine.capture();
});

document.getElementById('btnScreenShot').addEventListener('click', function(e) {
  CaptShare.engine.capture();
});

document.getElementById('btnCopyLink').addEventListener('click', function(e) {
  if(this.className != 'disabled') {
    CaptShare.engine.copyLink();
  }
});

document.getElementById('btnUpload').addEventListener('click', function(e) {
  CaptShare.engine.upload();
});

document.getElementById('btnHelp').addEventListener('click', function(e) {
  CaptShare.modal.showModal('help');
});

document.getElementById('btnCloseSettings').addEventListener('click', function(e) {
  CaptShare.modal.closeModal('settings');
});

document.getElementById('btnCloseHelp').addEventListener('click', function(e) {
  CaptShare.modal.closeModal('help');
});

document.getElementById('btnCloseHistory').addEventListener('click', function(e) {
  CaptShare.modal.closeModal('history');
});

document.getElementById('btnSettings').addEventListener('click', function(e) {
  CaptShare.modal.showModal('settings');
});

document.getElementById('btnHistory').addEventListener('click', function(e) {
  CaptShare.engine.updateHistoryData();
  CaptShare.modal.showModal('history');
});

chrome.app.window.current().onBoundsChanged.addListener(function() {
  CaptShare.engine.resizeCanvas();
});