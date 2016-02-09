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

  function copyLink() {
    var txtImgurLink = document.getElementById('txtImgurLink');
    if(txtImgurLink) {
      //copy to clipboard
      txtImgurLink.select();
      document.execCommand('copy');

      console.log('link copied: ', txtImgurLink.value);
    }
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

      var btnCopyLink = document.getElementById('btnCopyLink');
      if(btnCopyLink) {
        btnCopyLink.className = 'disabled';
        btnCopyLink.innerHTML = 'Uploading...';
      }

      canvas = document.createElement('canvas');

      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(vid, 0, 0);
      
      //generating image url
      var url = canvas.toDataURL();

      //update text to 'uploading'
      CaptShare.imgurAPI.upload(url, function() {
        console.log('uploaded');
        var btnCopyLink = document.getElementById('btnCopyLink');
        if(btnCopyLink) {
          btnCopyLink.className = 'enabled';
          btnCopyLink.innerHTML = 'Copy Link';

          //drawing attention once image is uploaded and link is copied
          chrome.app.window.current().drawAttention();
        }
      });

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

      //focusing window
      chrome.app.window.current().show();

    }
  }
  
return{
  capture: capture,
  copyLink: copyLink
}
  
})();
