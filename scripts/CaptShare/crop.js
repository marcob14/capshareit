if(typeof(CaptShare) != 'object') // object 
{
  var CaptShare = {};
}

CaptShare.crop = (function()
{
  function init() {
    //create div same size as canvas
    var cnvImage = document.getElementById('cnvImage');

    if(!cnvImage) {
      console.log('Canvas not found!');
      console.trace();
      return;
    }

    var cropContainer = document.getElementById('cropContainer');

    if(!cropContainer) {
      cropContainer = document.createElement('div');
    }

    cropContainer.id = 'cropContainer';
    cropContainer.style.width = cnvImage.style.width;
    cropContainer.style.height = cnvImage.style.height;
    cropContainer.style.cursor = 'crosshair';
    cropContainer.style.position = 'absolute';
    cropContainer.style.left = 0;
    cropContainer.style.right = 0;
    cropContainer.style.top = 0;
    cropContainer.style.margin = 'auto';
    cropContainer.style.marginTop = cnvImage.style.padding;

    var main = document.getElementById('main');
    
    if(!main) {
      console.log('Main Element not found!');
      return;
    }

    main.appendChild(cropContainer);

    var startx, starty, dragArea, selectingArea;

    var offsetX = cropContainer.offsetLeft;
    var offsetY = cropContainer.offsetTop;

    cropContainer.addEventListener("mousedown",function(e){
      if(e.button === 0) { //left click
        HandleLeftClick(e);
      }
    });

    cropContainer.addEventListener("mouseup",function(e){
      if(e.button === 0) { //left click
        HandleMouseUp(e);
      }
    });

    var HandleLeftClick = function(e) {
      if(e.srcElement.id == 'cropContainer') {
        selectingArea = true;
        console.log('click', e);
        console.log('leftmousedown x:', e.offsetX, ' y:', e.offsetY);
        var cropArea = document.getElementById('cropArea');

        if(cropArea) {
          cropContainer.removeChild(cropArea);
        }

        cropArea = document.createElement('div');

        startx = e.pageX - offsetX;
        starty = e.pageY - offsetY;

        cropArea.id = 'cropArea';
        cropArea.style.position = 'absolute';
        cropArea.style.border = '1px dashed #ccc';
        cropArea.style.opacity = 0.7;

        cropArea.style.top = e.pageY - offsetY;
        cropArea.style.left = e.pageX - offsetX;

        cropArea.style.width = 0;
        cropArea.style.height = 0;

        console.log('croparea style: ', cropArea.style);

        cropContainer.appendChild(cropArea);

        cropContainer.addEventListener("mousemove", HandleMouseMove);
        console.log('mousemove added');
      }
    }

    var HandleMouseMove = function(e) {
      console.log('mousemove', e);
      console.log('mousemove x:', e.pageX - offsetX, ' y:', e.pageY - offsetY);
      var cropArea = document.getElementById('cropArea');

// check with cropContainer border.. todo also in drag..

      var cursorX = e.pageX - offsetX;
      var cursorY = e.pageY - offsetY;

      if(cursorX < startx) {
        console.log('smaller');
        cropArea.style.left = cursorX;
        cropArea.style.width = startx - cursorX;
      } else {
        console.log('larger');
        cropArea.style.left = startx;
        cropArea.style.width = cursorX - startx;
      }

      //cropArea.style.height = e.pageY - starty;

      if(cursorY < starty) {
        console.log('smaller');
        cropArea.style.top = cursorY;
        cropArea.style.height = starty - cursorY;

      } else {
        console.log('larger');
        cropArea.style.top = starty;
        cropArea.style.height = cursorY - starty;
      }
    }

    var HandleMouseUp = function(e) {
      if(selectingArea) {
        console.log('leftmouseup x:', e.pageX - offsetX, ' y:', e.pageY - offsetY);
        var cropArea = document.getElementById('cropArea');
        cropArea.style.width = (e.pageX - offsetX) - startx;
        cropArea.style.height = (e.pageY - offsetY) - starty;
        cropArea.style.cursor = 'move';

        cropContainer.removeEventListener('mousemove', HandleMouseMove);
        console.log('mousemove removed');

        startx = starty = null;

        //add dragArea mouse events
        cropArea.addEventListener("mousedown",function(e){
          if(e.button === 0) { //left click
            StartDrag(e);
          }
        });

        cropArea.addEventListener("mouseup",function(e){
          if(e.button === 0) { //left click
            StopDrag(e);
          }
        });

        selectingArea = false;
      }
    }

    var StartDrag = function(e) {
      console.log('start drag');

      dragArea = {
        x: e.pageX - cropArea.offsetLeft,
        y: e.pageY - cropArea.offsetTop
      };

      cropArea.addEventListener("mousemove",Drag);

    }

    var Drag = function(e) {
      console.log('drag');

      nextY = e.pageY - dragArea.y;
      nextX = e.pageX - dragArea.x;

      if(nextY < 0) {
        //taking crae of the cropArea border
        nextY = -1;
      } 
      else if(nextY + cropArea.clientHeight > cropContainer.clientHeight) {
        //taking crae of the cropArea border
        nextY = cropContainer.clientHeight - cropArea.clientHeight - 1;
      }

      if(nextX < 0) {
        //taking crae of the cropArea border
        nextX = -1;
      } 
      else if(nextX + cropArea.clientWidth > cropContainer.clientWidth) {
        //taking crae of the cropArea border
        nextX = cropContainer.clientWidth - cropArea.clientWidth - 1;
      }

      cropArea.style.top = nextY;
      cropArea.style.left = nextX;
    }

    var StopDrag = function(e) {
      if(dragArea) {
        console.log('stop drag');

        dragArea = null;

        cropArea.removeEventListener("mousemove",Drag);
      }
    }


    //set cursor style, add event listeners

    //on 'esc' button > remove div (cancels cropping)
    //on new screenshot remove cropping

  }

  //on areacreated emitevent back to set button to 'apply'

  //another idea:
  // add 'x' and 'verygood' icons in the right bottom corners
  // of the crop area... very good = crop, 'x' = cancel.
  // crop button in toolbar will just enable the cropping tool
  // 'x' / esc button will disable the cropping tool ( deleting 
  // the div created above )


  //PS. need to handle window resizing (canvas is being resized..)
return {
  init: function() {
    init();
  }
}
  
})();