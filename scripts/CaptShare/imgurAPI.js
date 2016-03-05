if(typeof(CaptShare) != 'object') // object 
{
    var CaptShare = {};
}

//API Documentation:
//Image Options: https://api.imgur.com/endpoints/image
//Error handling: https://api.imgur.com/errorhandling

CaptShare.imgurAPI = (function()
{
  var clientID = 'Client-ID 91beea2a100108a';
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
        console.log('Error: ', resp.response.data.error);
        console.log('Method: ', resp.response.data.method);
        console.log('Request: ', resp.response.data.request);

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

      console.log(resp);

      parseResp(this, function(err, resp) {
        if(err) {
          cb(err);
        }

        CaptShare.history.add(resp.data, function() {});

        var url = 'https://imgur.com/gallery/' + resp.data.id;
        console.log(url);
        //window.open(url);

        console.log(resp.data.link);
        //window.open(resp.data.link);
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

    xhr.onreadystatechange = function(e) {
      console.log('ready state change!', e);
      if(this.status == 0) {
        console.log('error');
      }
    }

    xhr.onerror = function(e) {
      if(this.status == 0) {
        console.log('error');
        cb(this);
      }
    }

    xhr.send(formData);
  }

  //experimenting...
  function getImageInfo(id, cb) {
    console.log('getImageInfo');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', postImageURL+"/xiy3EnPch");
    xhr.setRequestHeader('Authorization', clientID);
    xhr.onload = function(e) {
      var resp = JSON.parse(this.response);

      console.log(resp);

      if (this.status == 200) {
        //...
      }
    };

    xhr.onerror = function(e) {
      if(this.status == 0) {
        console.log('error');
        cb(this);
      }
    }

    xhr.send();

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
  getImageInfo: function(id, cb) {
    getImageInfo(id, cb);
  },
  delete: function(deletehash, cb) {
    deleteImage(deletehash, cb);
  }
}
  
})();
