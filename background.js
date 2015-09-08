/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: "CaptShare",
    bounds: {
      width: 700,
      height: 600
    }
  });
  
  chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    switch(command) {
      case "capture":
        
        chrome.app.window.create('index.html', {
          id: "CaptShare",
          bounds: {
            width: 700,
            height: 600
          }
        });
        capture();
        
        // can load a transparent window - load the js needed - and close once done?..
        // this can also solve the desktopCapture window to be shown on top
        break;
      default:
        return;
    }
  });
});