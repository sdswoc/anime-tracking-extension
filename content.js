chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        if (request.state == "url_changed"){
            sendResponse({resp: "change acknowledged"});
            var vid = document.getElementsByClassName("AT-player")[0].getElementsByTagName("video")[0];
            vid.onloadeddata = function(){
                var per;
                var widthFunc = setInterval(checkWidth , 1000);

                function checkWidth(){
                    if(per>90.0){
                        console.log("now");
                        mutate();
                        clearInterval(widthFunc);
                    }
                    else{
                        var w = document.getElementsByClassName("handle")[0].style.width;
                        per = parseFloat(w);
                        console.log(per);
                    }
                }
            }
        }
});

function mutate(){
    chrome.storage.local.get(['anime_id','ep_no','code','total_eps'], function(result){
        var id, eps, accessToken;
        console.log(result);
        id = result.anime_id;
        eps = result.ep_no;
        accessToken = result.code;
        var stat = "CURRENT";
        var epTotal = result.total_eps;
        if(eps == epTotal){
            stat = "COMPLETED";
        }
        var query = `
        mutation ($mediaId: Int, $status: MediaListStatus, $progress: Int) {
            SaveMediaListEntry (mediaId: $mediaId, status: $status, progress: $progress) {
                id
                status
                progress
            }
        }
        `;
        var variables = {
            mediaId: id,
            status: stat,
            progress: eps
        }
        var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

        fetch(url, options).then((res)=>res.json())
        .then((data)=>console.log(data));
        });
}