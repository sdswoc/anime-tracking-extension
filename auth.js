authbtn = document.querySelector('#auth');
authbtn.addEventListener('click', authorise);

function authorise(){
    chrome.identity.launchWebAuthFlow(
        {
        'url': 'https://anilist.co/api/v2/oauth/authorize?client_id=2636&response_type=token',
        'interactive': true
        },
        function(url){
            const params = new URLSearchParams(url);
            var token  = params.get('access_token');
            chrome.storage.sync.set({code: token}, function() {
                console.log('Code is set to ' + token);
            });
    });
}