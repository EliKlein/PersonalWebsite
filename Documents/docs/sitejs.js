function removeClass(elements, className){
    while(elements.length > 0){
        elements[0].classList.remove(className);
    }
}
function tabOpen(tab){
    removeClass(document.getElementsByClassName("selected"), "selected");
    document.getElementById(tab+"L").classList.add("selected"); 
    document.getElementById(tab).classList.add("selected");
}