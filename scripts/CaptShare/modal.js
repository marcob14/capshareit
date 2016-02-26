//todo: take care of z-index

function showMessage(msg) {
	//create or edit div
	//showModal(divID);
}

function confirm(msg, cb, rememberChoice) {
	rememberChoice = rememberChoice || false;

	//create or edit div
	//showModal(divID);
	//callback true/false
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

function closeModal(id) {
  //need to check if there's another modal open or not...
  //in case an error message needs to be shown when a modal is already opened
  console.log('closeModal');

  var modal = document.getElementById(id);
  if(modal) {
    modal.style.display = 'none';
  }

  var divModalBg = document.getElementById('modalBg');
  if(divModalBg) {
    divModalBg.style.display = 'none';
  }
}