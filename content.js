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