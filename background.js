chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'twist.moe'},
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'kissanime.ru'},
          })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

var stream = [
  {
    host:"twist.moe",
    match:/\/.*\/.*\/.*/
  },
  {
    host:"kissanime.ru",
    match:/\/.*\/.*\/.*/
  }
]

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status === 'complete'){
      console.log("sending");
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {state: "url_changed"}, function(response) {
          console.log(response.resp);
        });
      });
      var x = document.createElement('a');
      x.href = tab.url;
      console.log(x);
      var y = stream.map(function(e) { return e.host; }).indexOf(x.hostname);
      console.log(y);
      if(y>=0&&x.pathname.match(stream[y].match)!=null){
          //if(changeInfo.status =='complete'){
            
          //}
          var path = x.pathname;
          console.log(path);
          var slash1 = path.indexOf('/',1);
          var slash2 = path.indexOf('/',slash1+1);
          var eps_string = path.substring(slash2+1);

          var eps = eps_string.match(/\d+/)[0];
          chrome.storage.local.set({ep_no: eps}, function() {
            console.log('Episode number is set to ' + eps);
          });

          var name = path.substring(slash1+1,slash2);
          
          var len = name.length;
          if(name.substring(len-4,len) == "-Dub"||name.substring(len-4,len) == "-dub"){
            name = name.substring(0,len-4);
          }
          if(name.substring(len-9,len) == "nd-season"||name.substring(len-9,len) == "nd-Season"){
            name = name.substring(0,len-9);
          }
          console.log(name);
          
          chrome.storage.local.get(['site'], function(res) {
            if(res.site == "anilist"){
              backAL();
            }
            if(res.site == "kitsu"){
              backKitsu();
            }
          });
      }
    }
});

function backAL(){
  var query = `
  query ($id: Int, $search: String) {
      Media (id:$id, search: $search) {
          id
          title{
            romaji
          }
          episodes
    }
  }
  `;

  var variables = {
      search: name,
  };

  var url = 'https://graphql.anilist.co',
      options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: query,
              variables: variables
          })
      };

  fetch(url, options).then((res)=>res.json())
  .then((data)=>{
      console.log(data);
      id = data.data.Media.id;
      epTotal = data.data.Media.episodes;
      chrome.storage.local.set({anime_id: id, total_eps: epTotal}, function() {
          console.log('Anime ID is set to ' + id);
          console.log('Total episodes are ' + epTotal);
      });
  });
}

function backKitsu(){
  fetch('https://kitsu.io/api/edge/anime?filter[text] ='+name)
.then(res => res.json())
.then(data => {
  console.log(data);
  id = data.data.id;
  epTotal = data.data.episodeCount;
  chrome.storage.local.set({anime_id: id, total_eps: epTotal}, function() {
    console.log('Anime ID is set to ' + id);
    console.log('Total episodes are ' + epTotal);
  });
})
.catch(error => console.error(error))
}

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    window.open("first.html");
  }
});