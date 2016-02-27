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
  var modal = {
    id: "hello",
    width: 300,
    height: 100,
    title: "Hello",
    message: "This is a test wuhu..",
    buttons: [
      {text:"cancel", action:function(){CaptShare.modal.closeModal('hello', true);}},
      {text:"ok", action:function(){console.log('ok!');}}
      ]
  }

  CaptShare.modal.showMessage(modal);

  CaptShare.modal.showModal('help');
});

document.getElementById('btnCloseSettings').addEventListener('click', function(e) {
  CaptShare.modal.closeModal('settings');
});

document.getElementById('btnCloseHelp').addEventListener('click', function(e) {
  CaptShare.modal.closeModal('help');
});

document.getElementById('btnSettings').addEventListener('click', function(e) {
  CaptShare.modal.showModal('settings');
});

chrome.app.window.current().onBoundsChanged.addListener(function() {
  CaptShare.engine.resizeCanvas();
});