chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: "CapShare",
    bounds: {
      width: 700,
      height: 400
    },
    resizable: false
  });
});

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  switch(command) {
    case "capture":
      
      // chrome.app.window.create('index.html', {
      //   id: "CapShare",
      //   bounds: {
      //     width: 700,
      //     height: 400
      //   },
      //   resizable: false
      // });
      //capture();
  CaptShare.engine.capture();

      
      // can load a smaller window - load the js needed - and close once done?..
      // to avoid js in the background
      // this can also solve the desktopCapture window to be shown on top
      break;
    default:
      return;
  }
});