if(typeof(CaptShare) != 'object') // object 
{
  var CaptShare = {};
}

CaptShare.settings = (function()
{
  var settings = {};
  var init = false;

  chrome.storage.sync.get('settings', function(data) {
    console.log('settings', data);

    data = data || {};
    settings = data.settings || {};
    init = true;
  })

  function saveToStorage(cb) {
    cb = cb || function(){};

    chrome.storage.sync.set({'settings': settings}, cb);
  }

  function updateSetting(id, value, cb) {
    cb = cb || function(){};

    settings[id] = value;
    saveToStorage(cb);
  }

  function getSetting(id, cb) {
    cb = cb || function(){};

    if(!init) {
      var iniInterval = setInterval(function() {
        if(init) {
          cb(settings[id]);
          clearInterval(iniInterval);
        }
      }, 1000);
    } else {
      cb(settings[id]);
    }
  }

return {
 set: function(id, value, cb) {
  updateSetting(id, value, cb);
 },
 get: function(id, cb) {
  getSetting(id, cb);
 }
}
	
})();
