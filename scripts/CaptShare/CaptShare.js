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

      canvas.id = 'cnvImage';
      canvas.style.padding = "10px";

      var main = document.getElementById('main');
      if(main) {
        main.appendChild(canvas);

        //setting canvas size
        resizeCanvas();
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

      var btnUpload = document.getElementById('btnUpload');
      if(btnUpload) {
        btnUpload.className = '';
        btnUpload.innerHTML = 'Upload';
      }

      var btnCopyLink = document.getElementById('btnCopyLink');
      if(btnCopyLink) {
        btnCopyLink.className = 'disabled';
      }

      var btnDelete = document.getElementById('btnDelete');
      if(btnDelete) {
        btnDelete.className = 'disabled';
      }

      //focusing window
      chrome.app.window.current().show();

    }
  }

  function upload() {
    //update text to 'uploading'
    var btnUpload = document.getElementById('btnUpload');
    if(btnUpload) {
      btnUpload.className = 'disabled';
      btnUpload.innerHTML = 'Uploading...';
    }

    var canvas = document.getElementById("cnvImage");
    if(!canvas) {
      console.log('canvas not found!');
      return;
    }

    var url = canvas.toDataURL();

    CaptShare.imgurAPI.upload(url, function(err, imageData) {
      if(err) {
        var modal = {
          id: "uploadError",
          width: 300,
          height: 120,
          title: "Error!",
          message: "There was an error while uploading the screenshot to imgur.",
          buttons: [
            {text:"ok", action:function(){CaptShare.modal.closeModal('uploadError', true);}}
          ]
        }

        CaptShare.modal.showMessage(modal);

        btnUpload.className = '';
        btnUpload.innerHTML = 'Upload';
        return;
      }

      console.log('uploaded');
      var btnCopyLink = document.getElementById('btnCopyLink');
      if(btnCopyLink) {
        btnCopyLink.className = 'enabled';
        btnCopyLink.innerHTML = 'Copy Link';

        //drawing attention once image is uploaded and link is copied
        chrome.app.window.current().drawAttention();
      }

      if(btnUpload) {
        btnUpload.innerHTML = 'Uploaded';
      }

      var btnCopyLink = document.getElementById('btnCopyLink');
      if(btnCopyLink) {
        btnCopyLink.className = '';
      }

      var btnDelete = document.getElementById('btnDelete');
      if(btnDelete) {
        btnDelete.className = '';

        console.log(imageData);

        btnDelete.addEventListener('click', function(e) {
          var confirmDeleteModal = {
            id: "confirmDelete",
            width: 300,
            height: 120,
            title: "Delete Confirmation",
            message: "Are you sure you want to delete the image from imgur?",
            buttons: [
              {text:"no", action:function(){CaptShare.modal.closeModal('confirmDelete', true);}},
              {text:"yes", action:function(){
                  //need delete hash & image id
                  CaptShare.imgurAPI.delete(imageData.deletehash, function(err) {
                    if(err) {
                      console.log('error while deleting');
                      var deleteErrorModal = {
                        id: "deleteError",
                        width: 300,
                        height: 120,
                        title: "Error!",
                        message: "There was an error while deleting the screenshot from imgur.",
                        buttons: [
                          {text:"ok", action:function(){CaptShare.modal.closeModal('deleteError', true);}}
                        ]
                      }

                      CaptShare.modal.showMessage(deleteErrorModal);
                      return;
                    }
                    console.log('deleted!');
                    CaptShare.history.remove(imageData.id, function() {
                      console.log('removed from history');

                      //show message & remove image? .. 
                      // need to work more on this..
                      // re-enable upload button?..

                      var deletedModal = {
                        id: "deleteSuccess",
                        width: 300,
                        height: 100,
                        title: "Success!",
                        message: "The image was successfully deleted from imgur.",
                        buttons: [
                          {text:"ok", action:function(){CaptShare.modal.closeModal('deleteSuccess', true);}}
                        ]
                      }

                      CaptShare.modal.showMessage(deletedModal);
                    });
                  });

                  CaptShare.modal.closeModal('confirmDelete', true);
                }
              }
            ]
          }

          CaptShare.modal.showMessage(confirmDeleteModal);
        });
      }
    });
  }

  function copyLink() {
    var txtImgurLink = document.getElementById('txtImgurLink');
    if(txtImgurLink) {
      //copy to clipboard
      txtImgurLink.select();
      document.execCommand('copy');

      var btnCopyLink = document.getElementById('btnCopyLink');
      if(btnCopyLink) {
        btnCopyLink.innerHTML = 'copied';

        window.setTimeout(function() {
          console.log(btnCopyLink);
          var btnCopyLink = document.getElementById('btnCopyLink');
          if(btnCopyLink) {
            btnCopyLink.innerHTML = 'Copy Link';
          }
        },1000);
      }

      console.log('link copied: ', txtImgurLink.value);
    }
  }

  function resizeCanvas() {
    var canvas = document.getElementById("cnvImage");
    if(canvas) {
      var height = window.innerHeight - 60;
      console.log("h:",window.innerHeight,"; w:",window.innerWidth);
      var width = (height * canvas.width / canvas.height);
      if(width > (window.innerWidth - 20)) {
        width = window.innerWidth - 20;
        height = (width * canvas.height / canvas.width);
      }

      canvas.style.height = height+'px';
      canvas.style.width = width+'px';
    }
  }
  
return{
  capture: capture,
  copyLink: copyLink,
  resizeCanvas: resizeCanvas,
  upload: upload
}
  
})();
