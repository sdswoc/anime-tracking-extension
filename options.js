chrome.storage.local.get(['percent'], function(result){
    console.log(result);
    var per = result.percent;
    document.getElementById("getper").placeholder = per;
});

document.getElementById("btn").onclick = function(){
    var per = document.getElementById("getper").value;
    if(per == ""){
        per = document.getElementById("getper").placeholder;
    }
    chrome.storage.local.set({percent: per}, function() {
        console.log("Percentage for change set to " + per);
    });
}