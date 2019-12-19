chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'twist.moe'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status =='complete'){
      console.log("sending");
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {state: "url_changed"}, function(response) {
          console.log(response.resp);
        });
      });
    }
    var el = document.createElement('a');
    el.href = changeInfo.url;
    if(el.hostname=="twist.moe"&&el.pathname!="/"){
        var path = el.pathname;
        console.log(path);
        var namend = path.indexOf('/',3);
        var eps = path.substring(namend+1);
        chrome.storage.local.set({ep_no: eps}, function() {
          console.log('Episode number is set to ' + eps);
        });

        var name = path.substring(3,namend);
        var query = `
        query ($id: Int, $search: String) {
            Media (id:$id, search: $search) {
                id
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
            chrome.storage.local.set({anime_id: id}, function() {
                console.log('Anime ID is set to ' + id);
            });
        });

    }
});