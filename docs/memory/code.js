// tiles currently flipping or flipped (this should never have length >2) - info about cards
var flipUpCheck = [], cardObjects = {}, mode, score, unmatched, gameOn, matchToCheck, hiScores = false;
const CARD_IMAGE_WIDTH = 125;
const CARD_IMAGE_HEIGHT = 175;

var cards_on_board = [];
var cards_available = [];
for(let i of ["H", "S", "D", "C"]){
    for(let j = 10; j > 0; j--) cards_available.push(j+i);
}
var RESET_TO = [];
function arraySoftCopy(from, to){
    for(let i of from) to.push(i);
}
arraySoftCopy(cards_available, RESET_TO); //every other time, we're going to do the opposite direction

//reference from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
//I didn't remember *exactly* how to do this and had to look up the exact function for randomness anyways
//(was hoping there was going to be more than one I found built-in)...
//sometimes copying is better than thinking... sometimes...
function arrayRandomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomPair(remaining_cards, suitOrValue){
    //FATAL ERROR CRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP
    if(remaining_cards.length <= 1) return [];

    let chosenCard = arrayRandomChoice(remaining_cards);
    //remove the randomly chosen card from the list before searching the list for cards that match it
    remaining_cards = remaining_cards.filter(function(i){return i!=chosenCard;});

    //(search for matches)
    let c = [];
    //match color and value
    if(suitOrValue == undefined){
        //char index 0 is value, index 1 is suit
        //if the suit of the chosen card is S or C, this is "SC", otherwise this is "HD"
        let matchableSuits = "SC".includes(chosenCard.charAt(1))?"SC":"HD";
        for(let i of remaining_cards){
            if(i.charAt(0)==chosenCard.charAt(0) && matchableSuits.includes(i.charAt(1))) c.push(i);
        }
    } else{
        for(let i of remaining_cards){
            if(i.charAt(suitOrValue)==chosenCard.charAt(suitOrValue)) c.push(i);
        }
    }
    //if there aren't any matches, retry (without the card that didn't have matches)
    if(c.length == 0) return randomPair(remaining_cards, suitOrValue);
    //otherwise, return the card and a random one of them
    console.log(chosenCard);
    return [chosenCard, arrayRandomChoice(c)];
}
function startGame(){
    if(gameOn == true){
        if(confirm("Do you want to re-start the current game? If you want to change the difficulty, you're meant to press Quit."))
            endGame(false);
        else return;
    }
    let board = document.getElementById("gridbox");
    let diffBox = document.getElementById("diff");

    gameOn = false;
    mode = diffBox.value == "n";
    diffBox.setAttribute("disabled","");
    board.style.height = (CARD_IMAGE_HEIGHT*3 + 30)+"px";
    for(let i in cardObjects) clearInterval(cardObjects[i].timer);
    cardObjects = {};
    for(let o of flipUpCheck) clearInterval(o.timer);//extra carefulness that isn't needed
    flipUpCheck = [];
    gameOn = true;
    document.getElementById("startbtn").textContent = "Restart";

    arraySoftCopy(RESET_TO, cards_available);
    cards_on_board = [];
    //the complicated version uses 4 columns, the normal version uses 6
    for(let i = 0; i < (mode?6:4); i++){
        let curcol = document.createElement("ul");
        curcol.classList.add("bcol");
        board.appendChild(curcol);
    }
    let pair;
    let colSet = document.getElementsByClassName("bcol");
    if(mode){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                //calling without the second argument is the same as calling with undefined as second arg
                //which is the case I check for when choosing the "normal" pairs
                pair = randomPair(cards_available);
                addButton(colSet[j*2], pair[0]);
                addButton(colSet[(j*2)+1], pair[1]);
            }
        }
    } else {
        for(let i = 0; i < 3; i++){
            pair = randomPair(cards_available, 1);
            addButton(colSet[0], pair[0]);
            addButton(colSet[1], pair[1]);

            pair = randomPair(cards_available, 0);
            addButton(colSet[2], pair[0]);
            addButton(colSet[3], pair[1]);
        }
    }
    matchToCheck = 0;
}

function endGame(completedGame){
    document.getElementById("diff").removeAttribute("disabled");
    document.getElementById("startbtn").textContent = "Start";
    document.getElementById("warn").style.display = "none";
}

function addButton(col, card){
    let bContainer = document.createElement("li");
    bContainer.classList.add("bcel");

    let btn = document.createElement("button");
    btn.id = card;
    btn.classList.add("card");
    btn.setAttribute("onclick", "tryFlip(this)");

    let spacer = document.createElement("li");
    spacer.classList.add("spacer");
    spacer.id = card+"_";

    let front = document.createElement("img");
    front.classList.add("card");
    front.src = "cards/"+card+".png";
    front.id = card + "f";

    let back = document.createElement("img");
    back.classList.add("card");
    back.src = "back.png";
    back.id = card + "b";
    back.style.display = "block"; //check back later

    btn.appendChild(back);
    btn.appendChild(front);
    col.appendChild(spacer);
    bContainer.appendChild(btn);
    col.appendChild(bContainer);

    cards_available.splice(cards_available.indexOf(card), 1);
    cards_on_board.push(card);
    
    let o = {id:btn.id, normal:true};
    cardObjects[btn.id] = o;
    o.timer = setInterval(flyUpIntoPlace, 25, o);
}

//using "button" (or "o") for the arbitrary objects I create, "btn" for DOM elements
const PACE1 = 5;
const PACE2 = 0.98;
function flyUpIntoPlace(button){
    let s = document.getElementById(button.id+"_");
    let h = s.offsetHeight;
    if(h <= PACE1) {
        h = 0;
        clearInterval(button.timer);
        button.normal = false;
        s.remove();
    }else{
        h = Math.floor((h*PACE2) - PACE1);
    }
    s.style.height = h+"px";
}

function tryFlip(btn){
    //disallow adding timer events when in the middle of resetting the board
    //(just being extra careful)
    if(!gameOn || hiScores) return;

    let o = cardObjects[btn.id];
    //"normal" continues to be true (therefore not undefined or false) until it's actually told
    //to flip downwards. I consider this the correct time to allow you to reflip the card
    //because it's better QOL if you see a card that you know you want to flip again right away
    //(like if you know the matching card's location) rather than waiting for it to go down all the way
    if(flipUpCheck.length < 2 && o.normal !== true){
        flipUpCheck.push(o);
        clearInterval(o.timer);

        let back = document.getElementById(btn.id + "b");
        back.style.left = "0px";
        back.style.width = CARD_IMAGE_WIDTH+"px";
        back.style.display = "block";

        //front only has one thing to do so I don't need a variable
        document.getElementById(btn.id+"f").style.display = "none";

        o.normal = true;
        o.timer=setInterval(flip, 25, o); //25 ms/frame -> 40 fps
    }
}

function flip(button){
    let back_ele, front_ele;
    if(button.normal) {
        back_ele = document.getElementById(button.id + "b");
        front_ele = document.getElementById(button.id + "f");
    } else {
        back_ele = document.getElementById(button.id + "f");
        front_ele = document.getElementById(button.id + "b");
    }
    //it wasn't working to grab the width from the style (I assume because it's set in css instead of
    //directly on the element) so I found this here https://stackoverflow.com/questions/294250/
    let bw = back_ele.offsetWidth - 12; //condensing to one line cuz the -12 just goes right after

    if(bw > 0) {
        back_ele.style.width = bw + "px";
        front_ele.style.width = "0px";
    } 
    let fw = front_ele.offsetWidth;
    if(bw <= 0){
        back_ele.style.display = "none";
        front_ele.style.display = "block"; // check back later
        if(fw < CARD_IMAGE_WIDTH) fw += 12;
        if(fw >= CARD_IMAGE_WIDTH) fw = CARD_IMAGE_WIDTH;
        front_ele.style.width = fw + "px";
    }
    if(fw == CARD_IMAGE_WIDTH){
        front_ele.style.left = 0;
        clearInterval(button.timer);

        //I prefer to make event functions happen outside of other functions, and it feels
        //about right to wait a fraction of a second before showing whether there's a match or not
        if(button.normal===true) setTimeout(flipEvent, 125, button);
    } else {
        front_ele.style.left = ((CARD_IMAGE_WIDTH - fw)/2) + "px";
        back_ele.style.left = ((CARD_IMAGE_WIDTH - bw)/2) + "px";
    }
}
function match(c1, c2, flop){
    if(mode){
        if("SC".includes(c1.charAt(1)) != "SC".includes(c2.charAt(1))) return false;
        return c1.charAt(0) == c2.charAt(0);
    }
    if(c1.charAt(matchToCheck) != c2.charAt(matchToCheck)) return false;
    if(flop) matchToCheck = 1 - matchToCheck;
    //update indicator for which type of match to seek
    return true;
}
function wipeUp(firstcall, who){
    if(firstcall){
        who.timer = setInterval(wipeUp, 25, false, clearing);
        return;
    }
    let ele = document.getElementById(who.id);
    let h = ele.offsetHeight;
    if(h > 0){
        h -= 16;
        ele.style.height = h + "px";
    } else {
        ele.remove();
        clearInterval(who.timer);
    }
}
function helperFn(card1, card2){
    let c1 = document.getElementById(card1.id), c2 = document.getElementById(card2.id);
    console.log(c1.style.opacity);
    if(c1.style.opacity > 0.5){
        c1.style.opacity-=0.05;
        c2.style.opacity=c1.style.opacity;
    } else {
        clearInterval(card1.timer);
    }
}
function fadeOut(){
    document.getElementById(flipUpCheck[0].id).style.opacity = 1;
    document.getElementById(flipUpCheck[1].id).style.opacity = 1;
    flipUpCheck[0].timer = setInterval(helperFn, 25, flipUpCheck[0], flipUpCheck[1]);
    flipUpCheck[1].timer = -1;
    flipUpCheck = [];
}
function flipEvent(obj){
    obj.up = true;
    if(flipUpCheck.length == 2 && flipUpCheck[0].up && flipUpCheck[1].up) {
        if(match(flipUpCheck[0].id, flipUpCheck[1].id, true)){
            cards_on_board.splice(cards_on_board.indexOf(flipUpCheck[0].id), 1);
            cards_on_board.splice(cards_on_board.indexOf(flipUpCheck[1].id), 1);
            cards_available.push(flipUpCheck[0].id);
            cards_available.push(flipUpCheck[1].id);
            score++;
            if(mode) setTimeout(fadeOut, 1000);
            else{
                setTimeout(wipeUp, 1000, true, flipUpCheck[0]);
                setTimeout(wipeUp, 1000, true, flipUpCheck[1]);
                flipUpCheck = [];
                //if any cards don't have a match
                if(cards_on_board.some(function(card, index, arr){
                    for(let j in arr){
                        if(j!==index && match(card, arr[j], false)) return false;
                    }
                    return true;
                })){// then...
                    //warn that the puzzle might be impossible to solve (regardless of what I add)
                    document.getElementById("warn").style.display = "block";

                    //and throw in 4 more cards
                    pair = randomPair(cards_available, 1);
                    addButton(colSet[0], pair[0]);
                    addButton(colSet[1], pair[1]);

                    pair = randomPair(cards_available, 0);
                    addButton(colSet[2], pair[0]);
                    addButton(colSet[3], pair[1]);
                }
            }
        } else {
            unmatched++;
            setTimeout(flipDown, 1500);
        }
    } else if(flipUpCheck.length > 2){//try to deal with a bug case that I'm not thinking will ever show up
        for(let o of flipUpCheck) clearInterval(o.timer);
        setTimeout(flipDown,0);
    }
}
function flipDown(){
    flipUpCheck.forEach(function(o){
        o.normal = false;
        o.up = false;
        o.timer = setInterval(flip, 25, o);
    });
    flipUpCheck = [];
}

function viewScores(){
    hiScores = !hiScores;
    if(hiScores){
        //show scores
    } else {
        //hide scores
    }
}