/**
 * Grabs the desktop capture feed from the browser, requesting
 * desktop capture. Requires the permissions
 * for desktop capture to be set in the manifest.
 *
 * @see https://developer.chrome.com/apps/desktopCapture
 */
var desktop_sharing = false;
var local_stream = null;
function toggle() {
    if (!desktop_sharing) {
        chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], onAccessApproved);
    } else {
        desktop_sharing = false;

        if (local_stream)
            local_stream.stop();
        local_stream = null;

        document.getElementById('btnCapture').innerHTML = "Enable Capture";
        document.getElementById('btnScreenshot').style.display = 'none';
        document.body.removeChild(document.querySelector('video'));
        console.log('Desktop sharing stopped...');
    }
}

function onAccessApproved(desktop_id) {
    if (!desktop_id) {
        console.log('Desktop Capture access rejected.');
        return;
    }
    desktop_sharing = true;
    document.getElementById('btnCapture').innerHTML = "Disable Capture";
    console.log("Desktop sharing started.. desktop_id:" + desktop_id);

    navigator.webkitGetUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: desktop_id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
            }
        }
    }, gotStream, getUserMediaError);

    function gotStream(stream) {
        local_stream = stream;
        console.log("Received local stream");
        var video = document.createElement('video');
        video.addEventListener('loadedmetadata',function(){
            document.getElementById('btnScreenshot').style.display = 'block';
        },false);
        video.src = URL.createObjectURL(stream);
        video.play();
        document.body.appendChild(video);

        stream.onended = function() {
            if (desktop_sharing) {
                toggle();
            }
        };
    }

    function getUserMediaError(e) {
      console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
    }
}

function takeScreenshot() {
    var canvas = document.createElement('canvas');
    var vid = document.querySelector('video');
    console.log(vid);
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(vid, 0, 0);
    var url = canvas.toDataURL();
    console.log(url);
    // will open the captured image in a new tab
    window.open(url);
}

/**
 * Click handler to init the desktop capture grab
 */
document.getElementById('btnCapture').addEventListener('click', function(e) {
    toggle();
});

document.getElementById('btnScreenshot').addEventListener('click', function(e) {
    takeScreenshot();
});
