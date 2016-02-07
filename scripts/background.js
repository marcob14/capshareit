chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: "CapShare",
    bounds: {
      width: 700,
      height: 400
    }
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
  
      break;
    default:
      return;
  }
});