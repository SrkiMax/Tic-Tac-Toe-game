
let isVsCpu = true;

const btnX = document.querySelector(".x-mark");
const btnO = document.querySelector(".o-mark");

const newGameMenu = document.querySelector(".new-game-menu");
const gameStartScreen = document.querySelector(".game-start");
const vsCpuBtn = document.querySelector(".btn-vs-cpu");
const vsPlayerBtn = document.querySelector(".btn-vs-player");

const restartBtn = document.querySelector(".btn-restart");
const board = document.querySelector(".board");

const restartOverlay = document.getElementById("restart-confirm");
const btnCancel = document.querySelector(".btn-cancel");
const btnConfirmRestart = document.querySelector(".btn-confirm-restart");

const winOverlay = document.querySelector(".overlay-win");
const btnQuit = document.querySelector(".btn-quit");
const btnNextRound = document.querySelector(".btn-next-round");

let currentTurn = "x"; // default starting turn is X, since X goes first
let markSelected = "o"; // o is selected by default


board.classList.add("o-hover");

const fields = document.querySelectorAll(".field");


// Fields focusable by keyboard

fields.forEach(field => field.setAttribute("tabindex", "0"));

// Call this function after each move
// Example: player clicks a field
// document.querySelectorAll('.field').forEach(field => {
//     field.addEventListener('click', () => {
//         // Your logic to mark the cell, etc.
//         toggleTurn(); // switch turn after valid move
//     });
// });


const greenPlayerText = document.querySelector(".green-player span");
const yellowPlayerText = document.querySelector(".yellow-player span");

let greenPlayerCounter = 0;
let tiesCounter = 0;
let yellowPlayerCounter = 0;


const greenScore = document.querySelector(".green-score");
const tiesScore = document.querySelector(".ties-score");
const yellowScore = document.querySelector(".yellow-score");

greenScore.textContent = greenPlayerCounter;
tiesScore.textContent = tiesCounter;
yellowScore.textContent = yellowPlayerCounter;




btnX.addEventListener("click", () => {
    currentTurn = "x";
    markSelected = "x";

    board.classList.add("x-hover");
    board.classList.remove("o-hover");

    btnX.classList.add("active");
    btnO.classList.remove("active");

});

btnO.addEventListener("click", () => {
    currentTurn = "o";
    markSelected = "o";

    board.classList.add("o-hover");
    board.classList.remove("x-hover");

    btnO.classList.add("active");
    btnX.classList.remove("active");
});



function startGame(vsCpu) {
    isVsCpu = vsCpu;

    currentTurn = "x"; // Always start with X


    // board.classList.add("x-hover", currentTurn === "x");
    // board.classList.remove("o-hover", currentTurn === "o");

    board.classList.toggle("x-hover", currentTurn === "x");
    board.classList.toggle("o-hover", currentTurn === "o");



    turnIconPath.setAttribute("d", xPathD); // Start icon is always X

    newGameMenu.style.display = "none";
    gameStartScreen.style.display = "flex";

    updateScoreLabels();

    if (isVsCpu && markSelected !== "x") {
        // User is O, CPU starts first
        setTimeout(cpuMove, 500);
    }


};

// Clear the board

function clearBoard() {
    fields.forEach(field => {
        field.classList.remove("marked", "marked-X", "marked-O", "winning");
    });
}




vsCpuBtn.addEventListener("click", () => startGame(true));
vsPlayerBtn.addEventListener("click", () => startGame(false));


function updateScoreLabels() {
    if (isVsCpu) {
        if (markSelected === "x") {
            greenPlayerText.textContent = "(YOU)";
            yellowPlayerText.textContent = "(CPU)"
        } else {
            greenPlayerText.textContent = "(CPU)";
            yellowPlayerText.textContent = "(YOU)"
        }
    } else {
        if (markSelected === "x") {
            greenPlayerText.textContent = "(P1)";
            yellowPlayerText.textContent = "(P2)";
        } else {
            greenPlayerText.textContent = "(P2)";
            yellowPlayerText.textContent = "(P1)";
        }
    }
}






// Restart

restartBtn.addEventListener("click", () => {
    restartOverlay.classList.remove("hidden");
});

btnCancel.addEventListener("click", () => {
    restartOverlay.classList.add("hidden");
});

btnConfirmRestart.addEventListener("click", () => {
    restartOverlay.classList.add("hidden");

    // Clear the board

    clearBoard();

    // Reset turn to X
    currentTurn = "x";
    board.classList.add("x-hover");
    board.classList.remove("o-hover");
    turnIconPath.setAttribute("d", xPathD);
});


// SVG path for X and O icons
const xPathD = "M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z";

const oPathD = "M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z";


const turnIconPath = document.getElementById("turn-icon-path");

// Change X or O turn consecutively
function toggleTurn() {
    currentTurn = currentTurn === "x" ? "o" : "x";

    board.classList.toggle("x-hover", currentTurn === "x");
    board.classList.toggle("o-hover", currentTurn === "o");

    // Update the path of the SVG icon
    turnIconPath.setAttribute("d", currentTurn === "x" ? xPathD : oPathD);
};


// Marking the fields
fields.forEach(field => {
    field.addEventListener("click", () => {
        if (field.classList.contains("marked")) return;

        if (isVsCpu && currentTurn !== markSelected) return;

        // Mark the field for currentTurn
        field.classList.add("marked", currentTurn === "x" ? "marked-X" : "marked-O");

        checkWin();
        toggleTurn();

        // If CPU's turn next
        if (isVsCpu && currentTurn !== markSelected) {
            setTimeout(cpuMove, 500);
        }
    });
});


const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

function checkWin() {

    for (const combo of winCombos) {
        const [a, b, c] = combo;

        if (
            fields[a].classList.contains("marked-X") &&
            fields[b].classList.contains("marked-X") &&
            fields[c].classList.contains("marked-X")

        ) {
            highlightWin(combo);
            updateScore("x");

            setTimeout(() => {
                showWinOverlay("x");
            }, 500);
            return;

        }

        if (fields[a].classList.contains("marked-O") &&
            fields[b].classList.contains("marked-O") &&
            fields[c].classList.contains("marked-O")
        ) {
            highlightWin(combo);
            updateScore("o");

            setTimeout(() => {
                showWinOverlay("o");
            }, 500);
            return;
        }
    }

    const isTie = [...fields].every(field => field.classList.contains("marked"));
    if (isTie) {
        tiesCounter++;
        tiesScore.textContent = tiesCounter;
        setTimeout(showTieOverlay, 500);
    }


};

function highlightWin(combo) {
    for (const i of combo) {
        fields[i].classList.add("winning");
    }

}

// Update Score

function updateScore(winner) {
    if (winner === "x") {

        greenPlayerCounter++;
        greenScore.textContent = greenPlayerCounter;
    } else if (winner === "o") {
        yellowPlayerCounter++;
        yellowScore.textContent = yellowPlayerCounter;
    }


    // const greenPlayerCounter = 0;
    // const tiesCounter = 0;
    // const yellowPlayerCounter = 0;


    // const greenScore = document.querySelector(".green-score");
    // const tiesScore = document.querySelector(".ties-score");
    // const yellowScore = document.querySelector(".yellow-score")


}




function showWinOverlay(winner) {
    winOverlay.style.display = "flex";

    const winMessage = document.querySelector(".win-message");
    const tieMessage = document.querySelector(".tie-message");
    const text = document.querySelector(".overlay-title-win");
    const icon = document.querySelector(".mark-icon");
    const colorText = document.querySelector(".takes-the-round-text");

    // Show win message, hide tie
    winMessage.classList.remove("hidden");
    tieMessage.classList.add("hidden");

    // Update icon and color
    icon.src = winner === "x" ? "assets/icon-x.svg" : "assets/icon-o.svg";
    colorText.style.color = winner === "x" ? "var(--Light-Blue)" : "var(--Light-Yellow)";


    // Update text based on game mode
    if (isVsCpu) {
        text.textContent = (markSelected === winner) ? "YOU WON!" : "OH NO, YOU LOST...";
    } else {
        // Player vs Player
        if (winner === "x") {
            text.textContent = (markSelected === "x") ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!";
        } else {
            text.textContent = (markSelected === "o") ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!";
        }
    }

}


function showTieOverlay() {
    winOverlay.style.display = "flex";

    const winMessage = document.querySelector(".win-message");
    const tieMessage = document.querySelector(".tie-message");

    // Hide win, show tie
    winMessage.classList.add("hidden");
    tieMessage.classList.remove("hidden");
}



// Quit the game function, resets data and returns back to the start screen

function quitGame() {
    clearBoard();
    resetScore();
    newGameMenu.style.display = "flex";
    gameStartScreen.style.display = "none";
    winOverlay.style.display = "none";

};


btnQuit.addEventListener("click", quitGame);



// Reset score

function resetScore() {
    greenPlayerCounter = 0;
    tiesCounter = 0;
    yellowPlayerCounter = 0;

    greenScore.textContent = greenPlayerCounter;
    tiesScore.textContent = tiesCounter;
    yellowScore.textContent = yellowPlayerCounter;
}


// Next Round function, resets data and returns back to the game board

function nextRound() {
    clearBoard();

    currentTurn = "x"; // Always start with X
    board.classList.toggle("x-hover", currentTurn === "x");
    board.classList.toggle("o-hover", currentTurn === "o");
    turnIconPath.setAttribute("d", xPathD);

    winOverlay.style.display = "none";

    if (isVsCpu && markSelected !== "x") {
        setTimeout(cpuMove, 500);
    }

};


btnNextRound.addEventListener("click", nextRound);


// If user choses to play VS CPU

function getCpuMark() {
    return markSelected === "x" ? "o" : "x";
}


function cpuMove() {
    const availableFields = [...fields].filter((field) => !field.classList.contains("marked"));
    if (availableFields.length === 0) return;

    const cpuMark = getCpuMark();


    const randomIndex = Math.floor(Math.random() * availableFields.length);
    const field = availableFields[randomIndex];

    field.classList.add("marked");

    field.classList.add(cpuMark === "x" ? "marked-X" : "marked-O");

    // currentTurn = cpuMark;

    toggleTurn();
    checkWin();
}




// Keyboard play
fields.forEach(field => {
    field.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            field.click();
        }
    });
});


