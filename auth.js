window.onload = function(){
    document.getElementById("auth").onclick = 
    function authorise(){
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
            chrome.storage.local.set({code: token}, function() {
                console.log('Code is set to ' + token);
            });
        });
    }
}