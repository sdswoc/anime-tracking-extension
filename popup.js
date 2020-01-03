var id;
chrome.storage.local.get(['anime_id'], function(result){
    console.log(result.anime_id);
    id = result.anime_id;
    chrome.storage.local.get(['site'], function(res) {
        if(res.site == "anilist"){
          viewAL(id);
        }
        if(res.site == "kitsu"){
          viewKitsu(id);
        }
    });
});

var eps;
chrome.storage.local.get(['ep_no'], function(result){
    console.log(result);
    eps = result.ep_no;
    document.getElementById("episode-no").innerHTML = eps;
});

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
        if (oldonload) {
            oldonload();
        }
        func();
        }
    }
}
addLoadEvent(makeOptionButton());

  

function makeOptionButton(){
    btn = document.getElementById("options");
    btn.onclick = function(){
        window.open('options.html');
    }
}

function viewAL(id){
    var query = `
    query ($id: Int) {
        Media (id: $id) {
            title  {
                romaji
            }
            description
        }
    }
    `;

    var variables = {
        id:id
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

    fetch(url, options)
    .then((res)=>res.json())
    .then((data)=>{
        var title = data.data.Media.title.romaji;
        var desc = data.data.Media.description;
        document.getElementById("anime-title").innerHTML = title;
        document.getElementById("description").innerHTML = desc;
    });
}

function viewKitsu(id){
    fetch('https://kitsu.io/api/edge/anime?filter[id]='+id)
    .then(res=>res.json())
    .then((data)=>{
        console.log(data);
        var title = data.data[0].attributes.titles.en_jp;
        var desc = data.data[0].attributes.synopsis;
        document.getElementById("anime-title").innerHTML = title;
        document.getElementById("description").innerHTML = desc;
    });
}