//todo: take care of z-index
//todo: add modal array list

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
//need to create the modalMessage div in case of multiple messages will be needed...
  var divModal = document.createElement('div');
  divModal.id = modal.id;
  divModal.className = 'modal';

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
    } else {
      modal.style.display = 'none';
    }
  }

  var divModalBg = document.getElementById('modalBg');
  if(divModalBg) {
    divModalBg.style.display = 'none';
  }
}