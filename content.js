var mutationDone = 0;
setInterval( getWidth , 1000);
function getWidth (){
    var w = document.getElementsByClassName("handle")[0].style.width;
    var percent = parseFloat(w);
    console.log(percent);
    if(percent>=90.0&&mutationDone == 0){
        console.log("now");
        mutationDone = 1;
    }
}