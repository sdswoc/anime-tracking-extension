chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {req: "anime-id"}, function(response) {
        id = response.resp;
        console.log(response.resp);
        var query = `
        query ($id: Int) {
            Media (id: $id) {
                title  {
                    english
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
            var title = data.data.Media.title.english;
            var desc = data.data.Media.description;
            document.getElementById("anime-title").innerHTML = title;
            document.getElementById("description").innerHTML = desc;
        });

    });
});


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {req: "anime-eps"}, function(response) {
        eps = response.resp;
        document.getElementById("episode-no").innerHTML = response.resp;
        console.log(response.resp);
    });
});