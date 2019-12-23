chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.storage.local.set({percent: 90}, function() {
            console.log("percent now 90");
        });
    }
});