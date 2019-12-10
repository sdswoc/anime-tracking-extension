var id,eps;

var path = window.location.pathname;
console.log(path);
var namend = path.indexOf('/',3);
eps = path.substring(namend+1);
var name = path.substring(3,namend);

chrome.storage.sync.set({eps_no: eps}, function() {
    console.log('Episode number is set to ' + eps);
});
    
setInterval( function (){
    var w = document.getElementsByClassName("handle")[0].style.width;
    chrome.storage.sync.set({anime_width: w}, function() {
        console.log('Anime width is set to ' + w);
    });
} , 1000);

var query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
        media (id: $id, search: $search) {
            id
       }
    }
}
`;

var variables = {
    search: name,
    page: 1,
    perPage: 1
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
    id = data.data.Page.media[0].id;
    console.log(id+" "+ eps);
    chrome.storage.sync.set({anime_id: id}, function() {
        console.log('Anime ID is set to ' + id);
    });
});