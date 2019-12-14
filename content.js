var path = window.location.pathname;
console.log(path);
var namend = path.indexOf('/',3);
eps = path.substring(namend+1);
var name = path.substring(3,namend);

/*chrome.storage.sync.set({eps_no: eps}, function() {
    console.log('Episode number is set to ' + eps);
});
    
setInterval( function (){
    var w = document.getElementsByClassName("handle")[0].style.width;
    chrome.storage.sync.set({anime_width: w}, function() {
        console.log('Anime width is set to ' + w);
    });
} , 1000);*/

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.req){
            case "anime-eps":
                sendResponse({resp: eps});
                console.log("sent "+eps);
                break;
        }
});

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
    console.log(id+" "+ eps);
    /*chrome.storage.sync.set({anime_id: id}, function() {
        console.log('Anime ID is set to ' + id);
    });*/
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            switch(request.req){
                case "anime-id":
                    sendResponse({resp: id});
                    console.log("sent id");
                    break;
            }
    });
});
