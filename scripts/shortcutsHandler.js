var CaptShareJS = document.createElement('script');
CaptShareJS.src = 'scripts/CaptShare/CaptShare.js';
document.head.appendChild(CaptShareJS);

imgurAPIJS = document.createElement('script');
imgurAPIJS.src = 'scripts/CaptShare/imgurAPI.js';
document.head.appendChild(imgurAPIJS);

// function capture() {
//   //chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], captureApproved);
//   chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], null, captureApproved);
// }

// function captureApproved(desktop_id) {
//     if (!desktop_id) {
//         console.log('Desktop Capture access rejected.');
//         return;
//     }
    
//     console.log("Desktop sharing started.. desktop_id:" + desktop_id);

//     navigator.webkitGetUserMedia({
//       audio: false,
//       video: {
//         mandatory: {
//             chromeMediaSource: 'desktop',
//             chromeMediaSourceId: desktop_id,
//             maxWidth: 4000,
//             maxHeight:4000 //setting max width & height for better image quality
//         }
//       }
//     }, gotStream, getUserMediaError);

//     function gotStream(stream) {
//         console.log("Received local stream");
//         var video = document.createElement('video');
//         video.addEventListener('loadedmetadata',function(){
//             //document.getElementById('btnScreenshot').style.display = 'block';
//             takeScreenshot(video, stream);
//         },false);
//         video.src = URL.createObjectURL(stream);
//         video.play();
//     }

//     function getUserMediaError(e) {
//       console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
//     }
// }

// function takeScreenshot(video, stream) {
//   var canvas = document.createElement('canvas');
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   var ctx = canvas.getContext("2d");
//   ctx.drawImage(video, 0, 0);
  
//   // //add watermark
//   // var watermark = document.getElementById("watermark");
//   // //changing alpha setting just for the watermark
//   // ctx.globalAlpha = 0.5;
//   // ctx.drawImage(watermark, canvas.width - 70, canvas.height - 70, 60, 60);
//   // ctx.globalAlpha = 1.0;
  
//   //generating image url
//   var url = canvas.toDataURL();
//   console.log(url);
  
//   //open the image in a new tab
//   window.open(url);
  
//   var a = document.createElement('a');
//   var d = new Date();
//   a.download = 'CaptShare_' + Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay());
//   a.href = url;
//   a.textContent = 'Click here to download!';
//   a.dataset.downloadurl = ['jpg', a.download, a.href].join(':');
//   a.click();
  
//   console.log('stopping stream ', stream);
//   stream.getTracks()[0].stop();
// }