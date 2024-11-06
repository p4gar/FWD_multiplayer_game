var errors = 0;
var score = 0;
var player2errors = 0;
var player2score = 0;
var currentPlayer = 1;
var mode;

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
];

var cardSet;
var board = [];
var rows = 4;
var columns = 5;

var card1Selected;
var card2Selected;

window.onload = function () {
    shuffleCards();
    startGame();

    const levelNumber = getQueryParam('level');
    mode = getQueryParam('mode');

    if (levelNumber) {
        localStorage.setItem('levelNumber', levelNumber);
    }

    if (mode === 'single') {
        document.getElementById("turnModal").style.display = "none";
        document.getElementById("nameModal").style.display = "none";

        setTimeout(hideCards, 5000);
    } else if (mode === 'multi') {
        showNameInputModal(); // Show the player name input modal first
    }
}

function shuffleCards() {
    cardSet = cardList.concat(cardList);
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length);
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg);

            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = "pokemon-cards/" + cardImg + ".jpg";
            card.classList.add("card");
            card.addEventListener("click", selectCards);
            document.getElementById("board").append(card);
        }
        board.push(row);
    }
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
        // Not a match: revert the cards and apply error/penalty points
        card1Selected.src = "pokemon-cards/back.jpg";
        card2Selected.src = "pokemon-cards/back.jpg";

        if (currentPlayer === 1) {
            errors += 1;
            document.getElementById("errors").innerText = errors;
            if (score > 0) {
                score -= 50;
                document.getElementById("score").innerText = score;
            }
        } else {
            player2errors += 1;
            document.getElementById("errors2").innerText = player2errors;
            if (player2score > 0) {
                player2score -= 50;
                document.getElementById("score2").innerText = player2score;
            }
        }
    } else {
        // Match found: reward points
        if (currentPlayer === 1) {
            score += 300;
            document.getElementById("score").innerText = score;
        } else {
            player2score += 300;
            document.getElementById("score2").innerText = player2score;
        }
    }

    // Reset selected cards
    card1Selected = null;
    card2Selected = null;

    // Switch players only if in multiplayer mode
    if (mode === 'multi') {
        showTurnModal();  // Show modal for player switch
    }

    // Check if the game is complete
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

    if (allFlipped && mode === 'single') {
        setTimeout(() => {
            alert("Congratulations! You've matched all cards.");
            window.location.href = `/quiz`;
            localStorage.setItem('game_score', score);
            localStorage.setItem('errors', errors);
        }, 500);
    }
    if(allFlipped && mode === 'multi'){
        if(score > player2score){
            alert(player1Name + " has won the game!");
            window.location.href = `/index`;
        } else {
            alert(player2Name + " has won the game!");
            window.location.href = `/index`;
        }
    }
}

function showNameInputModal() {
    const nameModal = document.getElementById("nameModal");
    const turnModal = document.getElementById("turnModal");

    nameModal.style.display = "block";
    turnModal.style.display = "none";

    // Handle name submission
    document.getElementById("submitNames").onclick = function () {
        // Get names from input fields or default values if blank
        player1Name = document.getElementById("player1Input").value || "Player 1";
        player2Name = document.getElementById("player2Input").value || "Player 2";

        // Display player names on the board
        document.getElementById("player1Name").textContent = player1Name;
        document.getElementById("player2Name").textContent = player2Name;

        // Hide the name input modal and start the game
        nameModal.style.display = "none";
        showTurnModal();
        setTimeout(hideCards, 5000);
    };
}

function showTurnModal() {
    const turnModal = document.getElementById("turnModal");
    turnModal.style.display = "block";

    // Set up event listeners for each player's button
    document.getElementById("player1Btn").onclick = function () {
        currentPlayer = 1;
        turnModal.style.display = "none";
    };

    document.getElementById("player2Btn").onclick = function () {
        currentPlayer = 2;
        turnModal.style.display = "none";
    };
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}



