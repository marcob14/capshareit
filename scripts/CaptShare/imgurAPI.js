if(typeof(CaptShare) != 'object') // object 
{
    var CaptShare = {};
}

//API Documentation:
//Image Options: https://api.imgur.com/endpoints/image
//Error handling: https://api.imgur.com/errorhandling

CaptShare.imgurAPI = (function()
{
  var clientID = 'Client-ID f95530734803997';
  var postImageURL = 'https://api.imgur.com/3/image';

  function parseResp(resp, cb) {
    cb = cb || function(){};

    var status = resp.status;
    switch(status) {
      case 200:
        cb(null, JSON.parse(resp.response));
        break;
      case 400:
        //This error indicates that a required parameter is missing 
        //or a parameter has a value that is out of bounds or otherwise incorrect. 
        //This status code is also returned when image uploads fail due to 
        //images that are corrupt or do not meet the format requirements.
      case 401:
        //The request requires user authentication. Either you didn't 
        //send send OAuth credentials, or the ones you sent were invalid.
      case 403:
        //Forbidden. You don't have access to this action. If you're getting this error, 
        //check that you haven't run out of API credits or make sure you're sending 
        //the OAuth headers correctly and have valid tokens/secrets.
      case 404:
        //Resource does not exist. This indicates you have requested a 
        //resource that does not exist. For example, requesting an image that doesn't exist.
      case 429:
        //Rate limiting. This indicates you have hit either the rate limiting 
        //on the application or on the user's IP address.
      case 500:
        //Unexpected internal error. What it says. We'll strive NOT to return these but your app 
        //should be prepared to see it. It basically means that something is broken with the Imgur service.
        cb(resp.response.data.error);
        break;
      default:
        cb('An unexpected error occured.');
    }
  }
  
  function uploadImage(img, cb) {
    cb = cb || function(){};

    //removing the first part of the DataURL "data:image/png;base64,"
    img = img.split(',')[1];
    
    var formData = new FormData();
    formData.append('image', img);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', postImageURL);
    xhr.setRequestHeader('Authorization', clientID);
    xhr.onload = function(e) {
      var resp = JSON.parse(this.response);

      parseResp(this, function(err, resp) {
        if(err) {
          cb(err);
        }

        var imgData = {
          id: resp.data.id,
          link: resp.data.link,
          deletehash: resp.data.deletehash,
          datetime: resp.data.datetime
        };

        CaptShare.history.add(imgData, function(err) {
          if(err) {
            var modal = {
              id: "addToHistoryError",
              width: 300,
              height: 160,
              title: "Error!",
              message: "There was an error while adding the newly uploaded screenshot to the history data. <br><br><span style='color:#666; font-size:0.9em;''>[ " + err + " ]</span>",
              buttons: [
                {text:"ok", action:function(){CaptShare.modal.closeModal('addToHistoryError', true);}}
              ]
            }

            CaptShare.modal.showMessage(modal);
          }
        });

        var url = 'https://imgur.com/gallery/' + resp.data.id;

        var txtImgurLink = document.getElementById('txtImgurLink');
        if(txtImgurLink) { 
          txtImgurLink.value = resp.data.link;

          //copy to clipboard
          txtImgurLink.select();
          document.execCommand('copy');
        }

        cb(null, resp.data);
      });
    };

    xhr.onerror = function(e) {
      if(this.status == 0) {
        cb(this);
      }
    }

    xhr.send(formData);
  }

  function deleteImage(deletehash, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', postImageURL+"/"+deletehash);
    xhr.setRequestHeader('Authorization', clientID);
    xhr.onload = function(e) {
      var resp = JSON.parse(this.response);

      if (this.status == 200) {
        //...
        cb();
      }
    };

    xhr.onerror = function(e) {
      if(this.status == 0) {
        cb(this);
      }
    }

    xhr.send();

  }
  
return{
  
  upload: function(img, cb) {
    uploadImage(img, cb);
  },
  delete: function(deletehash, cb) {
    deleteImage(deletehash, cb);
  }
}
  
})();
