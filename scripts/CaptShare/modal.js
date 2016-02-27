if(typeof(CaptShare) != 'object') // object 
{
  var CaptShare = {};
}

CaptShare.modal = (function()
{
  //todo: take care of z-index
  //todo: add modal array list
  var modalWindows = [];
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

  function showMessage(modal) {
  //add modal to modal array list
    console.log(modal);

    var zindex = 1000;

    if(modalWindows.length > 0) {
      //get z-index
      zindex = modalWindows[modalWindows.length-1].zindex + 1;
    }

    //need to create the modalMessage div in case of multiple messages will be needed...
    var divModal = document.createElement('div');
    divModal.id = modal.id;
    divModal.className = 'modal';
    divModal.style.zIndex = zindex;

    divModal.style.display = 'block';

    if(modal.width) {
      console.log('set width: ', modal.width);
      divModal.style.width = modal.width;
    }

    if(modal.height) {
      divModal.style.height = modal.height;
    }

    var mdlTitle = document.createElement('div');
    mdlTitle.className = 'modalTitle';
    mdlTitle.innerHTML = modal.title;
    divModal.appendChild(mdlTitle);

    var mdlMessage = document.createElement('div');
    mdlMessage.className = 'modalMessage';
    mdlMessage.innerHTML = modal.message;
    divModal.appendChild(mdlMessage);

    var mdlBtnCont = document.createElement('div');
    mdlBtnCont.className = 'modalButtonsCont';
    divModal.appendChild(mdlBtnCont);

    //set buttons
    for(var x = 0; x < modal.buttons.length; x++) {
      var btn = document.createElement('a');

      btn.className = "modalButton";
      btn.innerHTML = modal.buttons[x].text;
      console.log(modal.buttons[x].action);
      btn.addEventListener('click', modal.buttons[x].action);
      console.log(btn);

      mdlBtnCont.appendChild(btn);
    }
    
    document.body.appendChild(divModal);

    modalWindows.push({id:modal.id, zindex:zindex});
    console.log('modalWindows', modalWindows);

  }

  function showModal(id) {
    //array?.. to control modals & z-index.. 
    console.log('showModal');

    var modal = document.getElementById(id);
    if(modal) {
      modal.style.display = 'block';
    }

    var divModalBg = document.getElementById('modalBg');
    if(divModalBg) {
      divModalBg.style.display = 'block';
    }
  }

  function closeModal(id, remove) {
    //need to check if there's another modal open or not...
    //in case an error message needs to be shown when a modal is already opened
    console.log('closeModal');
    remove = remove || false;

    var modal = document.getElementById(id);
    if(modal) {
      if(remove) {
        document.body.removeChild(modal);
        for(var x = 0; x < modalWindows.length; x++) {
          if(modalWindows[x].id == id) {
            modalWindows.splice(x);
          }
        }
      } else {
        modal.style.display = 'none';
      }
    }

    var divModalBg = document.getElementById('modalBg');
    if(divModalBg) {
      divModalBg.style.display = 'none';
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