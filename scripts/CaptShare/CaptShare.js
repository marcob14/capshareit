var CaptShare = {
  init: function() 
  {
    for(var mthd in this) 
    {
      if(typeof(this[mthd].init) == 'function') 
      {
        this[mthd].init();
      }
    }
  }
};