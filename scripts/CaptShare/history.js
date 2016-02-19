if(typeof(CaptShare) != 'object') // object 
{
  var CaptShare = {};
}

CaptShare.history = (function()
{
  var history = [];
  var init = false;

  chrome.storage.sync.get('history', function(data) {
    console.log('history', data);

    data = data || {};
    history = data.history || [];
    init = true;
  })

  function saveToStorage(cb) {
    console.log('saveToStorage', history);
    cb = cb || function(){};

    chrome.storage.sync.set({'history': history}, cb);
  }

  function addHistoryEntry(data, cb) {
    cb = cb || function(){};
console.log(history);
    history.push(data);
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
          for(var x = 0; x < history.length; x++) {
            if(history[x].id === id) {
              cb(history[x]);
              clearInterval(iniInterval);
              return;
            }
          }
        }
      }, 1000);
    } else {
      for(var x = 0; x < history.length; x++) {
        if(history[x].id === id) {
          cb(history[x]);
          return;
        }
      }
    }
  }

  function deleteHistoryEntry(id, cb) {
    cb = cb || function(){};

    if(!init) {
      var iniInterval = setInterval(function() {
        if(init) {
          for(var x = 0; x < history.length; x++) {
            if(history[x].id === id) {
              history.splice(x, 1);
              saveToStorage(cb);
              clearInterval(iniInterval);
              return;
            }
          }
        }
      }, 1000);
    } else {
      for(var x = 0; x < history.length; x++) {
        if(history[x].id === id) {
          history.splice(x, 1);
          saveToStorage(cb);
        }
      }
    }
  }

return {
 add: function(data, cb) {
  addHistoryEntry(data, cb);
 },
 get: function(id, cb) {
  getHistoryEntry(id, cb);
 },
 getAll: function(cb) {
  getAllHistory(cb);
 },
 remove: function(id, cb) {
  deleteHistoryEntry(id, cb);
 }
}
  
})();

//get date & time of upload
//var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
//d.setUTCSeconds(temp1.history['ijpkcMb'].datetime);
