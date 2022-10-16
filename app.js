//main game variables
let guesses1 = document.getElementById("guesses1");
let guesses2 = document.getElementById("guesses2");
let str = document.querySelector("#debug");
let numGuesses=0;
let currBoxNum = 0;
let gameOver = false;

let answer1;
let answer2;
let words;
let guess = "";
let occurrencesInAnswer1;
let occurrencesInAnswer2;
let occurencesInGuess;
let win1 = false;
let win2 = false;

//keyboard rows
let firstRow = document.querySelector("#firstrow");
let secondRow = document.querySelector("#secondrow");
let thirdRow = document.querySelector("#thirdrow");

window.onload = function() {
    setAnswer();

    //create guess boxes
        for (let box=0; box<30; box++) {
            let c = document.createElement("div");
            c.id = box;
            c.classList.add("box");
            guesses1.appendChild(c);
        }

        for (let box=0; box<30; box++) {
            let c = document.createElement("div");
            c.id = box+30;
            c.classList.add("box");
            guesses2.appendChild(c);
        }

    //create keyboard
    let row1 = "QWERTYUIOP";
    let row2 = "ASDFGHJKL";
    let row3 = "ZXCVBNM";

    //listen to physical keyboard
    document.addEventListener('keyup', (event) => {
        setLetterWithKeyboard(event);
    });
    
    for (let i=0; i<row1.length; i++) {
        let keytile = document.createElement("div");
        keytile.classList.add("keytile");
        keytile.innerHTML = row1[i];
        keytile.id = "key" + row1[i];
        keytile.addEventListener("click", setLetter);
        firstRow.appendChild(keytile);
    }

    for (let i=0; i<row2.length; i++) {
        let keytile = document.createElement("div");
        keytile.classList.add("keytile");
        keytile.innerHTML = row2[i];
        keytile.id = "key" + row2[i];
        keytile.addEventListener("click", setLetter);
        secondRow.appendChild(keytile);
    }

    let enterKey = document.createElement("div");
    enterKey.classList.add("bigkeytile");
    enterKey.innerHTML = "ENTER";
    enterKey.addEventListener("click", () => setGuess());
    thirdRow.appendChild(enterKey);

    for (let i=0; i<row3.length; i++) {
        let keytile = document.createElement("div");
        keytile.classList.add("keytile");
        keytile.innerHTML = row3[i];
        keytile.id = "key" + row3[i];
        keytile.addEventListener("click", setLetter);
        thirdRow.appendChild(keytile);
    }


    let xKey = document.createElement("div")
    xKey.addEventListener("click", backspace);
    xKey.classList.add("bigkeytile");
    xKey.innerHTML = "←";
    thirdRow.appendChild(xKey);
}

async function setAnswer() {

    let ret = await fetch("http://127.0.0.1:5500/answerWords.txt");
    words = await ret.text();
    console.log(words);
    words = words.split("\n");
    
    for (let i=0; i<words.length; i++) {
        words[i]=words[i].substring(0,words[i].length-1);
        words[i] = words[i].toUpperCase();
    }

    //console.log("words:", words);

    //choose an answer for the game
    let index1 = Math.floor(Math.random()*words.length);
    answer1 = words[index1];
    let index2 = Math.floor(Math.random()*words.length);
    answer2 = words[index2];
    console.log(answer1, answer2);

    occurrencesInAnswer1 = [];
    occurrencesInAnswer2 = [];

    for (let letter of answer1) {
        if (occurrencesInAnswer1[letter]) {
            occurrencesInAnswer1[letter]++;
        } else {
            occurrencesInAnswer1[letter] = 1;
        }
    }

    for (let letter of answer2) {
        if (occurrencesInAnswer2[letter]) {
            occurrencesInAnswer2[letter]++;
        } else {
            occurrencesInAnswer2[letter] = 1;
        }
    }
}

function checkGuess() {
    //check guess against answer

    occurrencesInGuess = [];

    for (let letter of guess) {
        if (occurrencesInGuess[letter]) {
            occurrencesInGuess[letter]++;
        } else {
            occurrencesInGuess[letter] = 1;
        }
    }

//for board 1:
if (!win1) {
    for (let i=0; i<answer1.length; i++) {
        //str.innerHTML = "Occurrences in guess: " + occurrencesInGuess[guess[i]];
        //str.innerHTML += " Occurrences in answer: " + occurrencesInAnswer1[guess[i]];
        let id = i+numGuesses*5;
        let tile = document.getElementById(id);
        let keytile = document.getElementById("key" + tile.innerHTML);

        if (guess[i]===answer1[i]) {
            //tile turns green
            tile.style.backgroundColor = "#6AAA64";
            tile.style.borderColor = "#6AAA64";
            tile.style.color = "white";

            //key turns green
            keytile.style.backgroundColor = "rgb(106, 170, 100)";
            keytile.style.color = "white";

        }
        else if (answer1.includes(guess[i])) {
            console.log("background color of key tile: ", keytile.style.backgroundColor);
            //when the guess has more of a specific letter than the answer, turn tiles that are not in the correct place grey until the number of remaining letters in guess and the answer is the same

            if (keytile.style.backgroundColor != "rgb(106, 170, 100)") {
                keytile.style.backgroundColor = "#C9B458";
                keytile.style.color = "white";
            } 

            if (occurrencesInGuess[guess[i]] > occurrencesInAnswer1[guess[i]]) {
                //tile turns grey
                tile.style.backgroundColor = "#787C7E";
                tile.style.borderColor = "#787C7E";
                tile.style.color = "white";
                occurrencesInGuess[guess[i]]--;

            } else {
                //tile turns yellow
                tile.style.backgroundColor = "#C9B458";
                tile.style.borderColor = "#C9B458";
                tile.style.color = "white";
            }

        }
        else {
            //tile turns grey
            tile.style.backgroundColor = "#787C7E";
            tile.style.borderColor = "#787C7E";
            tile.style.color = "white";
        }
    }

}


if (!win2) {
    //for board 2:
    for (let i=0; i<answer2.length; i++) {
        //str.innerHTML = "Occurrences in guess: " + occurrencesInGuess[guess[i]];
        //str.innerHTML += " Occurrences in answer: " + occurrencesInAnswer2[guess[i]];
        let id = i+numGuesses*5+30;
        let tile = document.getElementById(id);
        let keytile = document.getElementById("key" + tile.innerHTML);

        if (guess[i]===answer2[i]) {
            //tile turns green
            tile.style.backgroundColor = "#6AAA64";
            tile.style.borderColor = "#6AAA64";
            tile.style.color = "white";

        }
        else if (answer2.includes(guess[i])) {
            console.log("background color of key tile: ", keytile.style.backgroundColor);
            //when the guess has more of a specific letter than the answer, turn tiles that are not in the correct place grey until the number of remaining letters in guess and the answer is the same

            if (keytile.style.backgroundColor != "rgb(106, 170, 100)") {
                keytile.style.backgroundColor = "#C9B458";
                keytile.style.color = "white";
            } 

            if (occurrencesInGuess[guess[i]] > occurrencesInAnswer2[guess[i]]) {
                //tile turns grey
                tile.style.backgroundColor = "#787C7E";
                tile.style.borderColor = "#787C7E";
                tile.style.color = "white";
                occurrencesInGuess[guess[i]]--;

            } else {
                //tile turns yellow
                tile.style.backgroundColor = "#C9B458";
                tile.style.borderColor = "#C9B458";
                tile.style.color = "white";
            }

        }
        else {
            //tile turns grey
            tile.style.backgroundColor = "#787C7E";
            tile.style.borderColor = "#787C7E";
            tile.style.color = "white";
        }
    }
}

    //number of guesses increases by 1
    numGuesses++;
}

async function setGuess() {
    //check if guess is valid
    //if guess is valid, go to check guess, if not, print invalid guess

    if (currBoxNum % 5 !== 4) {
        str.innerHTML = "Not enough letters!";
        return;
    }
 
    if (true) { //if (await validGuess() === true) { 
        checkGuess();
        if (checkWin()===false && gameOver === false) {
            //reset guess
            guess = "";
            currBoxNum++;
        }
    } else {
        str.innerHTML = "Invalid word";
    }
}

async function validGuess() {
    //array of valid five-letter guesses
    let ret = await fetch("http://127.0.0.1:5500/Wordle/wordleWords.txt");
    validWords = await ret.text();
    validWords = validWords.split("\n");

    //check if guess is a valid five-letter word in the dictionary
    for (let i=0; i<validWords.length; i++) {
        validWords[i] = validWords[i].toUpperCase();
    }
    //troubleshooting: console.log("valid guesses: " , validWords, guess);

    if (validWords.includes(guess)) {
        return true;
    }
    return false;
    
}

function checkWin() {
    //check if the winner has won or lost

    if (guess === answer1) {
        str.innerHTML = "Almost there!";
        win1 = true;
    }
    if (guess === answer2) {
        str.innerHTML = "Almost there!";
        win2 = true;
    }
    if (win1 && win2) {
        str.innerHTML = "You won!";
        return true;
    }
    if (numGuesses===6) {
        str.innerHTML = "You lost!";
    }
    return false;
}


function setLetter() {
    //set the letter when the keyboard tile is clicked or the key is pressed on the user's keyboard

    let box1 = document.getElementById(currBoxNum);
    let box2 = document.getElementById(currBoxNum + 30);

    if (box1.innerText.length !== 1) {
        if (!win1) {
            box1.innerHTML = this.innerHTML;
            box1.style.borderColor = "gray";
        }
        if (!win2) {
            box2.innerHTML = this.innerHTML;
            box2.style.borderColor = "gray";
        }
    }
    if (currBoxNum % 5 !== 4) {
        currBoxNum++;
    }

    //JS
    guess += this.innerHTML;
}

async function setLetterWithKeyboard(event) {

    //set guess when "enter" is clicked
    if (event.key === "Enter") {
        await setGuess();
    }

    //delete the current letter
    else if (event.key === "Backspace") {
        backspace();
    }


    //add a letter to guess
    else {
            let box1 = document.getElementById(currBoxNum);
            let box2 = document.getElementById(currBoxNum+30);
            if (box1.innerText.length !== 1) {
                if (!win1) {
                    box1.innerHTML = event.code[3];
                    box1.style.borderColor = "gray";
                }
                if (!win2) {
                    box2.innerHTML = event.code[3];
                    box2.style.borderColor = "gray";
                }

            }
            if (currBoxNum % 5 !== 4) {
                currBoxNum++;
            }
            guess += event.code[3];
    }
}

function backspace() {
    //delete the last letter in the guess

    let box1 = document.getElementById(currBoxNum);
    let box2 = document.getElementById(currBoxNum+30);


    if (currBoxNum % 5 === 0) {
        return;
    }

    if (box1.innerText.length === 1) {
        box1.innerHTML = ""; 
        box1.style.borderColor = "lightgray";
        box2.innerHTML = ""; 
        box2.style.borderColor = "lightgray";
    } else {
        currBoxNum--;
        box1 = document.getElementById(currBoxNum);
        box2 = document.getElementById(currBoxNum+30);
        box1.innerHTML = ""; 
        box1.style.borderColor = "lightgray";
        box2.innerHTML = ""; 
        box2.style.borderColor = "lightgray";
    }

    guess = guess.substring(0, guess.length-1);
}