if(typeof(CaptShare) != 'object') // object 
{
  var CaptShare = {};
}

CaptShare.history = (function()
{
  var history = [];
  var maxHistory = 20;

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

    chrome.storage.sync.get('history', function(data) {
      data = data || {};
      history = data.history || [];
      cb(history);
    })
  }

  function deleteHistoryEntry(id, cb) {
    cb = cb || function(){};

    chrome.storage.sync.get('history', function(data) {
      data = data || {};
      history = data.history || [];

      for(var x = 0; x < history.length; x++) {
        if(history[x].id === id) {
          history.splice(x, 1);
          saveToStorage(cb);
        }
      }
    })
  }

return {
 add: function(data, cb) {
  addHistoryEntry(data, cb);
 },
 getAll: function(cb) {
  getAllHistory(cb);
 },
 remove: function(id, cb) {
  deleteHistoryEntry(id, cb);
 }
}
  
})();
