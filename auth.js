document.getElementById("kitsu").onclick = function authoriseKitsu(){
    var arr = document.getElementsByClassName("kitsupport")
    for(i=0;i<5;i++){
        arr[i].style.display = "block";
    }

    document.getElementById("btn").onclick = function(){
        var username = document.getElementById("name").value;
        var password = document.getElementById("pass").value;

        const data = { 
            grant_type:'password',
            username:username,
            password:password
         };
        
        fetch('https://kitsu.io/api/oauth/token', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            token = data.access_token;
            chrome.storage.local.set({code: token, site: "kitsu"}, function() {
                console.log('Code is set to ' + token);
                console.log('You chose kitsu!')
            });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
}
document.getElementById("anilist").onclick = function authoriseAL(){
    chrome.identity.launchWebAuthFlow(
    {
        'url': 'https://anilist.co/api/v2/oauth/authorize?client_id=2636&response_type=token',
        'interactive': true
    },
    function(url){
        console.log(url);
        var start = url.search("=");
        var fin = url.search("&",start);
        var token = url.substring(start+1,fin);
        chrome.storage.local.set({code: token, site: "anilist"}, function() {
            console.log('Code is set to ' + token);
            console.log('You chose anilist!')
        });
    });
}