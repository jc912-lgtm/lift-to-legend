// Sequential Babel loader — compiles and executes JS files one at a time
// This avoids Babel choking on large files by processing them sequentially
(function(){
  var files=[
    'js/audio.js','js/data.js','js/utils.js','js/components.js',
    'js/animations.js','js/minigames.js',
    'js/screens.js','js/screens1b.js','js/screens2.js','js/screens2b.js',
    'js/screens2c.js','js/screens3.js','js/screens3b.js',
    'js/app.js'
  ];
  var idx=0;
  function loadNext(){
    if(idx>=files.length)return;
    var f=files[idx++];
    var xhr=new XMLHttpRequest();
    xhr.open('GET',f,true);
    xhr.onload=function(){
      if(xhr.status===200){
        try{
          var compiled=Babel.transform(xhr.responseText,{presets:['react']}).code;
          var script=document.createElement('script');
          script.textContent=compiled;
          document.body.appendChild(script);
        }catch(e){
          document.getElementById('root').innerHTML='<pre style="color:red;padding:20px">Error in '+f+':\n'+e.message+'</pre>';
          return;
        }
        loadNext();
      }else{
        document.getElementById('root').innerHTML='<pre style="color:red;padding:20px">Failed to load '+f+'</pre>';
      }
    };
    xhr.onerror=function(){
      document.getElementById('root').innerHTML='<pre style="color:red;padding:20px">Network error loading '+f+'</pre>';
    };
    xhr.send();
  }
  loadNext();
})();
