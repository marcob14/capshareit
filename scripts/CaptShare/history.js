if(typeof(CaptShare) != 'object') // object 
{
  var CaptShare = {};
}

CaptShare.history = (function()
{
  var history = [];
  var init = false;
  var maxHistory = 20;

  chrome.storage.sync.get('history', function(data) {
    data = data || {};
    history = data.history || [];
    init = true;
  })

  function saveToStorage(cb) {
    cb = cb || function(){};

    chrome.storage.sync.set({'history': history}, function() {
      if(!chrome.runtime.lastError) {
        cb();
      } else {
        cb(chrome.runtime.lastError.message);
      }
    });
  }

  function addHistoryEntry(data, cb) {
    cb = cb || function(){};

    if(history.length >= maxHistory) {
      var numToRemove = ((history.length - maxHistory) + 1);

      history.splice(0, numToRemove);
    }

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
