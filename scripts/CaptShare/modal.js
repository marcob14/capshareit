if(typeof(CaptShare) != 'object') // object 
{
  var CaptShare = {};
}

CaptShare.modal = (function()
{
  var modalWindows = [];

  function showMessage(modal) {
    var divModal = document.createElement('div');
    divModal.id = modal.id;
    divModal.className = 'modal';

    if(modal.width) {
      divModal.style.width = modal.width;
    }

    if(modal.height) {
      divModal.style.height = modal.height;
    }

    //adding title
    var mdlTitle = document.createElement('div');
    mdlTitle.className = 'modalTitle';
    mdlTitle.innerHTML = modal.title;
    divModal.appendChild(mdlTitle);

    //adding message
    var mdlMessage = document.createElement('div');
    mdlMessage.className = 'modalMessage';
    mdlMessage.innerHTML = modal.message;
    divModal.appendChild(mdlMessage);

    //adding buttons container
    var mdlBtnCont = document.createElement('div');
    mdlBtnCont.className = 'modalButtonsCont';
    divModal.appendChild(mdlBtnCont);

    //adding buttons
    for(var x = 0; x < modal.buttons.length; x++) {
      var btn = document.createElement('a');

      btn.className = "modalButton";
      btn.innerHTML = modal.buttons[x].text;
      btn.addEventListener('click', modal.buttons[x].action);

      mdlBtnCont.appendChild(btn);
    }
    
    document.body.appendChild(divModal);
    
    showModal(modal.id);
  }

  function showModal(id) {
    var zindex = 1000;

    if(modalWindows.length > 0) {
      zindex = modalWindows[modalWindows.length-1].zindex + 1;
    }

    var modal = document.getElementById(id);
    if(modal) {
      modal.style.zIndex = zindex;
      modal.style.display = 'block';
      modal.style.opacity = 1;

      modalWindows.push({id:id, zindex:zindex});

      var divModalBg = document.getElementById('modalBg');
      if(divModalBg) {
        divModalBg.style.display = 'block';
        divModalBg.style.opacity = 1;
      }
    }
  }

  function closeModal(id, remove) {
    remove = remove || false;

    var modal = document.getElementById(id);
    if(modal) {
      if(remove) {
        document.body.removeChild(modal);
      } else {
        modal.style.display = 'none';
        modal.style.opacity = 0;
      }

      for(var x = 0; x < modalWindows.length; x++) {
        if(modalWindows[x].id == id) {
          modalWindows.splice(x, 1);
        }
      }

      if(modalWindows.length == 0) {
        var divModalBg = document.getElementById('modalBg');
        if(divModalBg) {
          divModalBg.style.display = 'none';
          divModalBg.style.opacity = 0;
        }
      }
    }
  }

return {
 showMessage: function(modal) {
  showMessage(modal);
 },
 showModal: function(id) {
  showModal(id);
 },
 closeModal: function(id, remove) {
  closeModal(id, remove);
 }
}
  
})();

  //modalWindows = [
  //   {id:'', zindex:''},
  //   {id:'', zindex:''}
  // ]

  // modal = {
  //   id: ,
  //   width: ,
  //   height: ,
  //   title: "",
  //   message: "",
  //   buttons: [
  //     {text:"", action:""},
  //     {text:"", action:""}
  //     ]
  // }