var imageData = [];
var customTextSoFar = 0;
var editing = -1;
var ready = true;
//the thing about the "ready" variable noted in comments below is not the same reason for this variable
//this one is because it actually does take an indeterminate time to figure out whether something has
//loaded or not
var loadingImage = false;

function parseToImageObject(clear){
    let thisImage = {
        URL: document.getElementById("imgURL").value,
        top: document.getElementById("textTop").value,
        bot: document.getElementById("textBot").value,
        fontSize: document.getElementById("fontsize").value,
        cust:[]};
    if(clear){
        document.getElementById("imgURL").value = "";
        document.getElementById("textTop").value = "";
        document.getElementById("textBot").value = "";
        document.getElementById("fontsize").value = "28pt";
        hidePreview();
    }
    
    let arr = document.getElementsByClassName("cstTextTr");
    for(let i of arr){
        if(i.style.display!="none"){
            //extract the "customTextSoFar" value when that element was created (to find other ids later)
            thisImage.cust.push(i.id.slice(9));
            if(clear)i.style.display = "none";
        }
    }
    return thisImage;
}

function refreshImg(){
    let p = imageDiv(parseToImageObject(false), -1);
    document.getElementById("preview").replaceWith(p);
}
function hidePreview(){
    let p = document.createElement("div");
    p.id = "preview";
    document.getElementById("preview").replaceWith(p);
}
function editImage(imgIndex){
    //attempt to prevent problems caused by super-rapidly clicking things (mostly in the case where
    //you add so many custom text rowsthat your computer lags)
    if(!ready || loadingImage) return;
    ready = false;

    if(editing > -1) commit(false);
    else {
        if(document.getElementById("imgURL").value != ""){
            //push the current image and reset fields, if you were working on one
            addImg();
        } else {
            //scrap the current values if no image is provided -- the non-custom fields are replaced later
            for(let i of document.getElementsByClassName("cstTextTr")){
                if(i.style.display!="none") i.remove();
            }
        }
        //change "add" button to "commit edit" button because the image stays in the table while editing
        //so it has to behave differently
        document.getElementById("addImageButton").innerText = "Commit edit";
        document.getElementById("addImageButton").setAttribute("onClick","commit(true)");
    }
    editing = imgIndex;

    //put in old values
    document.getElementById("imgURL").value = imageData[imgIndex].URL;
    document.getElementById("textTop").value = imageData[imgIndex].top;
    document.getElementById("textBot").value = imageData[imgIndex].bot;
    document.getElementById("fontsize").value = imageData[imgIndex].fontSize;

    //show custom text divs again
    for(let i of imageData[imgIndex].cust) document.getElementById("cstTextTr"+i).style.display = "table-row";
    ready = true;
}
function commit(returnToAdd){
    if(returnToAdd){
        //return to the add image button
        document.getElementById("addImageButton").innerText = "Add it!";
        document.getElementById("addImageButton").setAttribute("onClick","addImg()");
    }

    //check changes, reset the form, and update the data object
    let replace = parseToImageObject(true);
    imageData[editing] = replace;

    //create a replacement (not in the document yet) with the same id as the image that already exists
    let replacementDiv = imageDiv(imageData[editing], editing);
    // ... and replace the node that currently has that id with the new node
    document.getElementById(replacementDiv.id).replaceWith(replacementDiv);

    //allow for new images to be added (this value is immediately set again afterwards when re-editing)
    editing = -1;
};
function addImg(){
    //this should only happen if you super rapidly click the "Commit edit" button,
    //or are really messing with something
    if(editing > -1) return;

    let thisImage = parseToImageObject(true);
    imageData.push(thisImage);

    document.getElementsByTagName("body")[0].appendChild(imageDiv(thisImage, imageData.length-1));
}
function imageDiv(info, idNum){
    let divReturn = document.createElement("div");
    //I'd be concerned about the below line if this wasn't part of a public repository anyways
    divReturn.classList.add("customImageDiv");
    if(idNum < 0) divReturn.id = "preview";
    else divReturn.id = "imageDiv"+idNum;

    //credit to https://stackoverflow.com/questions/18837735/check-if-image-exists-on-server-using-javascript
    //for, well, answering the question asked there

    loadingImage = true;
    let img = document.createElement("img");
    divReturn.appendChild(img);
    //putting text on after loading the image because the relevant variables stay around for the
    //functions here, and because I don't want text on the File Not Found images (it's obstructive)
    //I figure that if you add something that doesn't load, you'll notice and change it before you
    //do something that would make it hard to remember which of several File Not Found images you were
    //trying to fix (and even if you do, you can just hit edit on them one at a time without having to
    //hit commit and losing your place)
    img.onload = function(){
        let size = info.fontSize;
        if(size == "") size = "28pt";
        //the condition below is false if Number(size) is NaN, and it doesn't matter
        //if size is negative or 0 because those would have the same resulting
        //look regardless (setting to default font size) ... unfortunately NaN does not equal NaN
        if(Number(size) > 0) size += "pt";
        //imageText inherits font size from the div it's in, but the overall div needs
        //font size 0 to avoid annoying spacing things relating to inline-block display
        let textDiv = divReturn.appendChild(document.createElement("div"));
        textDiv.style.fontSize = size;

        let t = textDiv.appendChild(document.createElement("div"));
        t.classList.add("imageText");
        t.appendChild(document.createTextNode(info.top));
        t.style.left = "50%";
        t.style.top = "15%";

        t = textDiv.appendChild(document.createElement("div"));
        t.classList.add("imageText");
        t.appendChild(document.createTextNode(info.bot));
        t.style.left = "50%";
        t.style.top = "85%";

        for(let i of info.cust){
            t = textDiv.appendChild(document.createElement("div"));
            t.classList.add("imageText");
            let inputNode = document.getElementById("cstTextInp"+i);
            t.appendChild(document.createTextNode(inputNode.value));
            t.style.left = inputNode.getAttribute("addAtX");
            t.style.top = inputNode.getAttribute("addAtY");
        }
        loadingImage = false;
    };
    img.onerror = function(){
        //if it can't load the error image and I don't remove the onerror function, I think it would
        //keep calling the function over and over
        img.onload = null;
        img.onerror = null;
        img.src = "forgotImage.png"
        loadingImage = false;
    };
    img.src = info.URL;

    if(idNum > -1){
        let btns = divReturn.appendChild(document.createElement("div"));
        btns.innerHTML =
`<button onclick="editImage(`+idNum+`)" class="editBtn"></button>
<button onclick="delImage(`+idNum+`)" class="trashBtn"></button>`;
    }
    return divReturn;
}
function addTextLoc(){
    let row = document.createElement("tr");
    row.id = "cstTextTr"+customTextSoFar;
    row.classList.add("cstTextTr");
    //I was doing this manually for a while but it was really tedious and probably
    //just a worse idea outright.
    row.innerHTML = 
`<td>Extra Text</td>
<td><input id="cstTextInp`+customTextSoFar+`" type="text" class="textInput" addAtX="50%" addAtY="50%"></td>
<td><button class="removeText" onclick="removeText('cstTextTr`+customTextSoFar+`');"></button></td>
<td><input type="text" class="textInput" value="50%" onchange="setTX('cstTextInp`+customTextSoFar+`', this.value)"></td>
<td><input type="text" class="textInput" value="50%" onchange="setTY('cstTextInp`+customTextSoFar+`', this.value)"></td>`;
    document.getElementById("textInputs").appendChild(row);
    customTextSoFar++;
}
function delImage(id){
    //I don't have a good solution (yet?) for deleting an image while editing that image (and then
    //commiting the edit) ... I'm not sure it causes problems, but I would bet it does.
    if(editing>-1) return;
    document.getElementById("imageDiv"+id).remove();
    //garbage collecting invisible table rows
    for(let i of imageData[id].cust){
        document.getElementById("cstTextTr"+i).remove();
    }
}
function removeText(id){
    document.getElementById(id).remove();
}
function setTX(id, val){
    document.getElementById(id).setAttribute("addAtX", val);
}
function setTY(id, val){
    document.getElementById(id).setAttribute("addAtY", val);
}