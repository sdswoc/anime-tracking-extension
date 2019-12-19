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
