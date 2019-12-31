   chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        if (request.state == "url_changed"){
            sendResponse({resp: "change acknowledged"});
            var vid = document.getElementsByClassName("AT-player")[0].getElementsByTagName("video")[0];
            vid.onloadeddata = function(){
                var per;
                var widthFunc = setInterval(checkWidth , 1000);
                var reqper;

                function checkWidth(){
                    chrome.storage.local.get(['percent'],function(result){
                        reqper = result.percent;
                        if(per>reqper){
                            console.log("now");
                            chrome.storage.local.get(['site'], function(res) {
                                if(res.site == "anilist"){
                                  mutateAL();
                                }
                                if(res.site == "kitsu"){
                                  mutateKitsu();
                                }
                            });
                            clearInterval(widthFunc);
                        }
                        else{
                            var w = document.getElementsByClassName("handle")[0].style.width;
                            per = parseFloat(w);
                            console.log(per);
                        }
                    });
                }
            }
        }
});

function mutateAL(){
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

function mutateKitsu(){
    chrome.storage.local.get(['anime_id','ep_no','code','total_eps'], function(result){
        var id, eps, accessToken;
        console.log(result);
        id = result.anime_id;
        eps = result.ep_no;
        accessToken = result.code;
        var stat = "current";
        var epTotal = result.total_eps;
        if(eps == epTotal){
            stat = "completed";
        }

        fetch( 'https://kitsu.io/api/edge/users?filter[self]=true',{
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            },
            
        }).then(res=>res.json()).then(data=>{
            console.log(data);
            var userid = data.data[0].id;
            fetch('https://kitsu.io/api/edge/users/'+userid+'/library-entries?filter[animeId]='+id)
            .then(res=>res.json()).then(data2=>{
                console.log(data2);
                if(data2.meta.count==0){
                    var body = {
                        data:{
                            type:"libraryEntries",
                            attributes:{
                                status:stat,
                                progress:eps
                            },
                            relationships:{                
                                anime:{
                                    data:{id:id,type:"anime"}                                    
                                },
                                user:{
                                    data:{id:userid,type:"users"}
                                }
                            }
                        }
                    };
                    
                    var url = 'https://kitsu.io/api/edge/library-entries',
                    options = {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Accept': 'application/vnd.api+json',
                            'Content-Type': 'application/vnd.api+json'
                        },
                        body: JSON.stringify(body)
                    };

                    fetch(url, options).then((res)=>res.json())
                    .then((data)=>console.log(data));
                }

                else{
                    var entryId = data2.data[0].id;
                    fetch('https://kitsu.io/api/edge/library-entries/'+entryId,{
                        method: 'PATCH',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Accept': 'application/vnd.api+json',
                            'Content-Type': 'application/vnd.api+json'
                        },
                        body: JSON.stringify({
                            data:{
                                type:"libraryEntries",
                                id:entryId,
                                attributes:{
                                    status:stat,
                                    progress:eps
                                }
                            }
                        })
                    }).then(res=>res.json()).then(data=>console.log(data));
                }
            })
        });            
    });
}