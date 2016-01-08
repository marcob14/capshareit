if(typeof(CaptShare) != 'object') // object 
{
    var CaptShare = {};
}

CaptShare.imgurAPI = (function()
{
  var clientID = 'Client-ID 91beea2a100108a';
  var postImageURL = 'https://api.imgur.com/3/image';
  
  function uploadImage(img) {
    //removing the first part of the DataURL "data:image/png;base64,"
    img = img.split(',')[1];
    
    var formData = new FormData();
    formData.append('image', img);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', postImageURL);
    xhr.setRequestHeader('Authorization', clientID);
    xhr.onload = function(e) {
      console.log(this.response);
      var resp = JSON.parse(this.response);
      console.log(resp);
      //todo handle errors
      //400 bad image

      if (this.status == 200) {
        var url = 'https://imgur.com/gallery/' + resp.data.id;
        console.log(url);
        //window.open(url);

        console.log(resp.data.link);
        //window.open(resp.data.link);
        document.getElementById('txtImgurLink').value = resp.data.link;

      }
    };

    xhr.send(formData);
  }
  
return{
  
  upload: function(img){
    uploadImage(img);
  }
}
  
})();
