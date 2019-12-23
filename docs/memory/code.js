// tiles currently flipping or flipped (this should never have length >2) - info about cards
var flipUpCheck = [], cardObjects = {}, mode, score, gameOn, matchToCheck, hiScores = false, help=true;
const CARD_IMAGE_WIDTH = 125;
const CARD_IMAGE_HEIGHT = 175;

var scoreList = [];
try{
    if(localStorage.getItem("scores")){
        for(let i in localStorage.getItem("scores").split(",")) scoreList.push({score:Number(i)});
        localStorage.getItem("dates").split(",").forEach(function(d, ind){scoreList[ind].date = d});
    }
}catch(e){console.log(e)}

var cards_on_board = [];
var cards_available = [];
var RESET_TO = [];
for(let i of ["H", "S", "D", "C"]){
    for(let j = 0; j < 10; j++) RESET_TO.push(j+i);
}
function resetAvailable(){
    cards_available = [];
    for(let i of RESET_TO) cards_available.push(i);
}
resetAvailable();

function startGame(){
    document.getElementById("oneScore").style.display = "none";
    document.getElementById("info").style.display = "none";
    help = false;
    if(gameOn == true){
        if(confirm("Do you want to re-start the current game? If you want to change the mode, you're meant to press Quit."))
            endGame(false);
        else return;
    }
    let board = document.getElementById("gridbox");
    let diffBox = document.getElementById("diff");
    let ind = document.getElementById("indicator");

    //just in case somehow you're clicking a button while the game is being set up
    hiScores = true;
    //and here just in case somehow a button (container) wasn't deleted
    delButtons();
    hiScores = false;

    score = 0;

    diffBox.setAttribute("disabled","");
    mode = diffBox.value == "n";
    if(!mode) ind.style.display = "block";
    board.style.height = (CARD_IMAGE_HEIGHT*3 + 30)+"px";
    for(let i in cardObjects) clearInterval(cardObjects[i].timer);
    cardObjects = {};
    for(let o of flipUpCheck) clearInterval(o.timer);//extra carefulness that isn't needed
    flipUpCheck = [];
    gameOn = true;
    document.getElementById("startbtn").textContent = "Restart";

    resetAvailable();
    cards_on_board = [];

    let colSet = document.getElementsByClassName("bcol");
    while(colSet.length > 0)colSet[0].remove();

    //the complicated version uses 4 columns, the normal version uses 6
    for(let i = 0; i < (mode?6:4); i++){
        let curcol = document.createElement("ul");
        curcol.classList.add("bcol");
        board.appendChild(curcol);
    }
    let adds = [];
    matchToCheck = 0;
    
    //I had forgotten this, so I'll note it-- adding a pair each time means it needs to loop
    //half as many times as the number of cards I want to add
    for(let i = 0; i < (mode?9:6); i++){
        adds.push(...card_bookkeeping(randomPair(cards_available)));
        matchToCheck = 1 - matchToCheck;
    }
    ind.src = "valueInd.png";//["valueInd.png", "suitInd.png"][matchToCheck];
    for(let i = 0; i < colSet.length; i++){
        for(let j=0; j<3; j++) {
            addButton(colSet[i], adds.splice(arrayRandomIndex(adds), 1)[0]);
        }
    }
}

function endGame(completedGame){
    if(mode){
        if(completedGame) setTimeout(fadeOut, 1000); //this line is skipped when the game ends normally
        delButtons(2000);
    } else {
        delButtons(1500);
    }
    document.getElementById("diff").removeAttribute("disabled");
    document.getElementById("startbtn").textContent = "Start";
    document.getElementById("warn").style.display = "none";
    document.getElementById("indicator").style.display = "none";
    document.getElementById("info").style.display = "none";
    help = false;
    if(hiScores)viewScores();//hides scores when hiScores is true
    gameOn = false;
    if(completedGame){
        //close help screen if it's open

        //find out where your score lands you
        let place = scoreList.findIndex(function(i){return i > score})+1;

        //if place is -1, then this is undefined, but also isn't used later
        let stndrdth = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][place%10]
        document.getElementById("oneScore").innerHTML =
            "You did it!<br/>You ended up with " + score + " guesses." +
            ((place > 0) ? "<br/>That gets you " + place + stndrdth + " place":"");
        //actually show what score you got
        showScore(false);
        
        //insert score to the correct sorted spot
        //(unfortunately, splice(-1 ...) inserts just before the last element)
        let date = new Date(Date.now()).toDateString();
        if(place > 0) scoreList.splice(place - 1, 0, {"score":score, "date":date});
        else scoreList.push({"score":score, "date":date});

        while(scoreList.length > 20) scoreList.pop();
        
        //save scores to local storage
        try{
            localStorage.setItem("scores", scoreList.map(function(i){return i.score}).join(","));
            localStorage.setItem("dates", scoreList.map(function(i){return i.date}).join(","));
        }catch(e){console.log(e)}
    }
}

function info(){
    help = !help;
    if(help) document.getElementById("info").style.display = "block";
    else document.getElementById("info").style.display = "none";
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
    //so you can't click through high score display
    if(hiScores) return;

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
function flipEvent(btn){
    btn.up = true;
    if(flipUpCheck.length == 2 && flipUpCheck[0].up && flipUpCheck[1].up) {
        //scorekeeping
        score++;
        if(match(flipUpCheck[0].id, flipUpCheck[1].id, true)){
            //bookkeeping
            cards_on_board.splice(cards_on_board.indexOf(flipUpCheck[0].id), 1);
            cards_on_board.splice(cards_on_board.indexOf(flipUpCheck[1].id), 1);
            cards_available.push(flipUpCheck[0].id);
            cards_available.push(flipUpCheck[1].id);
            if(cards_on_board.length == 0){
                endGame(true);
                return;
            }
            if(mode) setTimeout(fadeOut, 1000);
            else{
                flipUpCheck[0].timer = setTimeout(wipeUp, 1500, true, flipUpCheck[0]);
                flipUpCheck[1].timer = setTimeout(wipeUp, 1500, true, flipUpCheck[1]);
                //if not(there is a match somewhere)
                if(cards_on_board.length < 2 || !cards_on_board.some(function(c1, i, arr){
                    return arr.some(function(c2, j){
                        //if it's not trying to match to itself, and it does match based on current match type
                        if(i!==j && match(c1, c2, false)) return true;
                    });
                })){// then...
                    //try to add 4 cards, each matching one random card on the board in alternating fashion

                    //so that it doesn't swap what match the player is supposed to look for afterwards
                    let oldMatch = matchToCheck;

                    //array of up to four unique cards from the available cards which each match
                    //a unique card on the board, and having alternated which type of match it
                    //looked for each time -- not searching through the cards that were just flipped up
                    //because otherwise they have to do two animations at once and it screws up
                    let toAdd = randomSolutionsAdd(cards_on_board, cards_available.filter(function(card){
                        return !flipUpCheck.some(function(i){return i==card;});
                    }), 0);
                    //(it alternates after finding a card, meaning the next match to look for
                    //in the while loop below is correct)
                    card_bookkeeping(toAdd);

                    //Add cards to the list two at a time until there's 3 or 4 cards in the list...
                    //There's probably never going to be less than 4, but I'm not gonna go
                    //investigate that, because I'm only realizing this after I already did this
                    while(toAdd.length < 3) {
                        //warn that the it might be impossible to win (I don't think that it's guaranteed
                        //to be impossible or infinitely impossible but I do think it could be
                        //indefinitely impossible, and there's no way I'm going to figure out about
                        //that logic without thinking about it for hours)

                        //I don't *like* doing this operation every loop but hey it's not doing real harm
                        document.getElementById("warn").style.display = "block";

                        //still not allowed to use cards that are also in flipUpCheck
                        toAdd.push(...card_bookkeeping(randomPair(cards_available.filter(function(card){
                            return !flipUpCheck.some(function(i){return i==card;});
                        }))));
                        matchToCheck = 1 - matchToCheck;
                    }
                    //I don't suspect this will happen because for one thing it's impossible to
                    //have more than 10 cards before adding more
                    //also I don't suspect it will be impossible just because of this putting things
                    //outside of the board
                    if(cards_on_board.length > 12) document.getElementById("warn").style.display = "block";

                    matchToCheck = oldMatch;

                    let cols = Array.from(document.getElementsByClassName("bcol"), function(i){
                        return {ele:i,len:i.querySelectorAll("bcel").length};
                    });
                    while(toAdd.length > 0){
                        //add to the shortest column
                        cols.sort(function(a, b){return a.len - b.len});
                        addButton(cols[0].ele, toAdd.splice(arrayRandomIndex(toAdd), 1)[0]);
                        //continue to keep track of lengths
                        cols[0].len++;
                    }
                }
                flipUpCheck = [];
            }
        } else {
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
function wipeUp(firstcall, who){
    if(firstcall){
        who.timer = setInterval(wipeUp, 25, false, who);
    }
    let fele = document.getElementById(who.id+"f");
    let bele = document.getElementById(who.id+"b");
    
    let fh = fele.offsetHeight;
    let bh = bele.offsetHeight;
    if(fh > 16 || bh > 16){
        fh -= 16;
        bh -= 16;
        fele.style.height = fh + "px";
        bele.style.height = bh + "px";
    } else {
        document.getElementById(who.id).parentElement.remove();
        clearInterval(who.timer);
    }
}
function fadeOut(){
    document.getElementById(flipUpCheck[0].id).style.opacity = 1;
    document.getElementById(flipUpCheck[1].id).style.opacity = 1;
    flipUpCheck[0].timer = setInterval(fadeAni, 25, flipUpCheck[0], flipUpCheck[1]);
    flipUpCheck[1].timer = -1;
    flipUpCheck = [];
}
function fadeAni(card1, card2){
    let c1 = document.getElementById(card1.id), c2 = document.getElementById(card2.id);
    if(c1.style.opacity > 0.5){
        c1.style.opacity-=0.05;
        c2.style.opacity=c1.style.opacity;
    } else {
        clearInterval(card1.timer);
    }
}

function showScore(all){
    document.getElementById(all?"scorebox":"oneScore").style.display = "block";
}

//form of a high score to add:
//"<li>#: # Guesses - [date]</li>" and {score:#, date:[date]}
//I want to store up to 20 scores total. That's just an arbitrary decision for how many.
function viewScores(){
    hiScores = !hiScores;
    let box = document.getElementById("scorelist");
    if(hiScores){
        document.getElementById("oneScore").style.display = "none";
        if(scoreList.length == 0) box.innerHTML = "No scores yet.";
        else{ box.innerHTML = "";
            scoreList.forEach(function(i, p){
                let e = document.createElement("li");
                e.textContent = (p+1)+": "+i.score+" Guesses - "+i.date;
                box.appendChild(e);
            });
        }
        showScore(true);
    } else {
        document.getElementById("scorebox").style.display = "none";
    }
}

//check for matches (flop -> whether to make it swap to looking for the other type of match afterwards)
function match(c1, c2, flop){
    //normally just check if it's the same color and number
    if(mode) return c1.charAt(0) == c2.charAt(0) && isRedCard(c1) == isRedCard(c2);

    //complicated mode: check if it's the same suit or the same number depending on which one you just found
    if(c1.charAt(matchToCheck) != c2.charAt(matchToCheck)) return false;
    if(flop) {
        matchToCheck = 1 - matchToCheck;
        document.getElementById("indicator").src = ["valueInd.png", "suitInd.png"][matchToCheck];
    }
    //update indicator for which type of match to seek
    return true;
}

function card_bookkeeping(cs){
    cs.forEach(function(card){
        cards_available.splice(cards_available.indexOf(card), 1);
        cards_on_board.push(card);
    });
    return cs;
}

//reference from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
//I didn't remember *exactly* how to do this and had to look up the exact function for randomness anyways
//(was hoping there was going to be more than one I found built-in)...
//sometimes copying is better than thinking... sometimes...
function arrayRandomChoice(arr) {return arr[Math.floor(Math.random() * arr.length)];}
function arrayRandomIndex(arr){return Math.floor(Math.random() * arr.length);}

function randomPair(fromCards){
    //FATAL ERROR CRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP idk what to do about this
    if(fromCards.length < 2) return [];

    let chosenCard = arrayRandomChoice(fromCards);
    //list all cards that match chosenCard
    let matches = fromCards.filter(function(i){return match(i, chosenCard, false) && i != chosenCard});
    //if there aren't any matches, retry (recur) without looking at the card that didn't have matches
    if(matches.length == 0)
        return randomPair(fromCards.filter(function(i){return i!=chosenCard;}));

    //otherwise, return the card and a random one of the matches
    return [chosenCard, arrayRandomChoice(matches)];
}

//recur to find up to four matches each between a card on the board and a card that is available
//returning them as an array
//--largely based on the function above it
function randomSolutionsAdd(currBoard, currAvailable, totLength){
    //if there are no (more) matches to be found, or there have already been four matches found,
    //then stop recurring
    if(currBoard.length == 0 || totLength > 3) return [];

    //card from board
    let bCard = arrayRandomChoice(currBoard);
    //list all cards that match it
    let matches = currAvailable.filter(function(i){ return match(i, bCard, false) && i != bCard});

    //we're no longer interested in bCard after listing its matches
    let next = currBoard.filter(function(i){return i!=bCard;})
    //either it had no matches...
    if(matches.length == 0)
        return randomSolutionsAdd(next, currAvailable, totLength);
    //or it's now been used for a match

    //swap match type to check for, for the next recursion (because a match has been found)
    matchToCheck = 1 - matchToCheck;

    //choose a random one of the matches from above
    let aCard = arrayRandomChoice(matches);
    //recur, looking at all the un-chosen cards that haven't been shown not to have any matches
    //in the available cards
    //also communicate that one more match has been found, for the next loop
    //also make sure to add "aCard" together with the next found card(s)
    return [aCard].concat(
        randomSolutionsAdd(next, currAvailable.filter(function(i){return i!=aCard}), totLength+1)
    );
}


function delButtons(delay){
    console.log(delay);
    if(delay===undefined){
        for(let btns = document.getElementsByClassName("bcel"); btns.length > 0; btns[0].remove());
        return;
    }
    let btns = Array.from(document.querySelectorAll(".bcel>button"));
    console.log(btns);
    for(let i of btns) cardObjects[i.id].timer = setTimeout(wipeUp, delay, true, cardObjects[i.id]);
}
function isRedCard(c){
    return "HD".includes(c.charAt(1));
}