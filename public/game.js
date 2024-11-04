var errors = 0;
var score = 0;


var cardList = [
    "darkness",
    "double",
    "fairy",
    "fighting",
    "fire",
    "grass",
    "lightning",
    "metal",
    "psychic",
    "water"
]

var cardSet;
var board = [];
var rows = 4;
var columns = 5;

var card1Selected;
var card2Selected;

window.onload = function () {
    shuffleCards();
    startGame();
    const levelNumber = getQueryParam('level'); // Retrieve the level number from the URL
    if (levelNumber) {
        localStorage.setItem('levelNumber', levelNumber);        
    }
}

function shuffleCards() {
    cardSet = cardList.concat(cardList);
    // shuffling logic
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length); // get random index
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
}

function startGame() {
    // arrange the board on a 4x5
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg);

            // creates a dynamic card element in html
            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = "pokemon-cards/" + cardImg + ".jpg";
            card.classList.add("card");
            card.addEventListener("click", selectCards);
            document.getElementById("board").append(card);
        }
        board.push(row);
    }
    setTimeout(hideCards, 2000);
}

function hideCards() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            card.src = "pokemon-cards/back.jpg";
        }
    }
}

function selectCards() {
    if (this.src.includes("back")) {
        if (!card1Selected) {
            card1Selected = this;

            let coords = card1Selected.id.split("-");
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card1Selected.src = "pokemon-cards/" + board[r][c] + ".jpg";
        }
        else if (!card2Selected && this != card1Selected) {
            card2Selected = this;
            let coords = card2Selected.id.split("-");
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card2Selected.src = "pokemon-cards/" + board[r][c] + ".jpg";
            setTimeout(update, 1000);
        }
    }
}

function update() {
    const card1Filename = card1Selected.src.split('/').pop();
    const card2Filename = card2Selected.src.split('/').pop();
    if (card1Selected.src != card2Selected.src) {
        card1Selected.src = "pokemon-cards/back.jpg";
        card2Selected.src = "pokemon-cards/back.jpg";
        errors += 1;
        if (score > 0) {
            score -= 50;
        }
        document.getElementById("errors").innerText = errors;
        document.getElementById("score").innerText = score;
    }
    if (card1Filename === card2Filename) {
        score += 300;
        document.getElementById("score").innerText = score;
    }
    // reset both card 1 and card 2;
    card1Selected = null;
    card2Selected = null;

    checkGameComplete();
}

function checkGameComplete() {
    let allFlipped = true;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            if (card.src.includes("back")) {
                allFlipped = false;
                break;
            }
        }
        if (!allFlipped) break;
    }

    if (allFlipped) {
        // Game is complete, show message
        setTimeout(() => {
            alert("Congratulations! You've matched all cards.");
            window.location.href = `/quiz`;
            localStorage.setItem('game_score', score);        
            localStorage.setItem('errors', errors);        
        }, 500);
    }
}



function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}