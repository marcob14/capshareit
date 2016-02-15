if(typeof(CaptShare) != 'object') // object 
{
  var CaptShare = {};
}

CaptShare.history = (function()
{
  var history = {};
  var init = false;

  chrome.storage.sync.get('history', function(data) {
    console.log('history', data);

    data = data || {};
    history = data.history || {};
    init = true;
  })

  function saveToStorage(cb) {
    cb = cb || function(){};

    chrome.storage.sync.set({'history': history}, cb);
  }

  function addHistoryEntry(id, data, cb) {
    cb = cb || function(){};

    history[id] = data;
    saveToStorage(cb);
  }

  function getAllHistory(cb) {
    cb = cb || function(){};

    if(!init) {
      var iniInterval = setInterval(function() {
        if(init) {
          cb(history);
          clearInterval(iniInterval);
        }
      }, 1000);
    } else {
      cb(history);
    }
  }

  function getHistoryEntry(id, cb) {
    cb = cb || function(){};

    if(!init) {
      var iniInterval = setInterval(function() {
        if(init) {
          cb(history[id]);
          clearInterval(iniInterval);
        }
      }, 1000);
    } else {
      cb(history[id]);
    }
  }

  function deleteHistoryEntry(id, cb) {
    cb = cb || function(){};

    if(!init) {
      var iniInterval = setInterval(function() {
        if(init) {
          delete history[id];
          saveToStorage(cb);
          clearInterval(iniInterval);
        }
      }, 1000);
    } else {
      delete history[id];
      saveToStorage(cb);
    }
  }

return {
 add: function(id, data, cb) {
  addHistoryEntry(id, data, cb);
 },
 get: function(id, cb) {
  getHistoryEntry(id, cb);
 },
 getAll: function(cb) {
  getAllHistory(cb);
 },
 delete: function(id, cb) {
  deleteHistoryEntry(id, cb);
 }
}
  
})();

//get date & time of upload
//var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
//d.setUTCSeconds(temp1.history['ijpkcMb'].datetime);
