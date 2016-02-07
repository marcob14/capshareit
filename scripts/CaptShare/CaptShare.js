if(typeof(CaptShare) != 'object') // object 
{
    var CaptShare = {};
}

CaptShare.engine = (function()
{ 
  var local_stream = null;
  var local_stream_track = null;

  function capture() {
    chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], onAccessApproved);
  }

  function onAccessApproved(desktop_id) {
    if (!desktop_id) {
      return;
    }

    //console.log("Desktop sharing started.. desktop_id:" + desktop_id);

    navigator.webkitGetUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: desktop_id,
          maxWidth: 4000,
          maxHeight:4000 //setting max width & height for better image quality
        }
      }
    }, gotStream, getUserMediaError);

    function gotStream(stream) {
      local_stream = stream;
      local_stream_track = stream.getTracks()[0];
      //console.log("Received local stream");

      var video = document.createElement('video');
      video.addEventListener('loadedmetadata',function() {
        takeScreenshot(video);

        local_stream_track.stop();
    
        local_stream = null;
        local_stream_track = null;

        //console.log('Desktop sharing stopped...');
      },false);

      video.src = URL.createObjectURL(stream);
      //video.style.top = "-1000px";
      video.play();
      //document.body.appendChild(video);

      stream.onended = function() {
        //console.log('STREAM ENDED!!!!');
      };      
    }

    function getUserMediaError(e) {
      console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
    }

    function takeScreenshot(vid) {
      var canvas = document.getElementById("cnvImage");
      if(canvas) {
        canvas.parentNode.removeChild(canvas);
      }

      canvas = document.createElement('canvas');

      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(vid, 0, 0);
      
      //generating image url
      var url = canvas.toDataURL();
      
      //open the image in a new tab
      //window.open(url);

      CaptShare.imgurAPI.upload(url);

      canvas.id = 'cnvImage';
      canvas.style.padding = "10px";
      var height = window.innerHeight - 60;
      console.log("h:",window.innerHeight,"; w:",window.innerWidth);
      var width = (height * canvas.width / canvas.height);
      if(width > (window.innerWidth - 20)) {
        width = window.innerWidth - 20;
        height = (width * canvas.height / canvas.width);
      }

      canvas.style.height = height+'px';
      canvas.style.width = width+'px';
      var main = document.getElementById('main');
      if(main) {
        main.appendChild(canvas);
      }
      
      var btnDownload = document.getElementById('btnDownload');
      if(btnDownload) {
        var d = new Date();
        btnDownload.download = 'CaptShare_' + Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay());
        btnDownload.href = url;
        btnDownload.dataset.downloadurl = ['jpg', btnDownload.download, btnDownload.href].join(':');
        btnDownload.className = '';
      }

      var optionsMenu = document.getElementById('options');
      if(optionsMenu) {
        optionsMenu.style.display = 'block';
      }

      var btnScreenShot = document.getElementById('btnScreenShot');
      if(btnScreenShot) {
        btnScreenShot.style.display = 'none';
      }


    }
  }
  
return{
  capture: capture
}
  
})();
