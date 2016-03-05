chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: "CapShare",
    innerBounds: {
      width: 730,
      height: 450,
      minWidth: 730,
      minHeight: 450
    }
  });
});

chrome.commands.onCommand.addListener(function(command) {
  switch(command) {
    case "capture":
      chrome.app.window.create('index.html', {
        id: "CapShare",
        innerBounds: {
          width: 730,
          height: 450,
          minWidth: 730,
          minHeight: 450
        }
      }, function(win) {
        var jsload = setInterval( 
          function() {
            if(win.contentWindow.CaptShare) {
              win.contentWindow.CaptShare.engine.capture();
              clearInterval(jsload);
            }
          }, 100);
      });
  
      break;
    default:
      return;
  }
});