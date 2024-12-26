
// SET BOARD

var board = [];
var rows = 8;
var columns = 8;

var minesCount = 7;
var minesLocation = []; // will be used as ID ex: '2,2', '3,4'

var tilesClicked = 0; // goal to click all tiles except the ones containing mines
var flagEnabled = false; 

var gameOver = false;

window.onload = function() {
    startGame();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("start-button").addEventListener("click", restartGame);
    setMines();

    // populate board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (c = 0; c < columns; c++) {
            // create <div id="r-c"></div>
            let tile = document.createElement('div');
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile)
            document.getElementById("board").append(tile);
            row.push(tile)
        }
        board.push(row);
    }

    console.log(board);
}


function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "rgb(224, 230, 232)";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "rgb(118, 178, 198)";
    }
}

function restartGame() {
    location.reload()
}

function clickTile() {

    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
        tile.innerText = "";
        }
        return;
    }   

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER")
        alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣"
                tile.style.backgroundColor = "rgb(254, 233, 222)"
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // top 3
    minesFound += checkTile(r-1, c-1); //top left
    minesFound += checkTile(r-1, c); //top
    minesFound += checkTile(r-1, c+1); //top right

    // left & right
    minesFound += checkTile(r, c-1); //left
    minesFound += checkTile(r, c+1); //right

    // bottom 3
    minesFound += checkTile(r+1, c-1); //bottom left
    minesFound += checkTile(r+1, c); //bottom
    minesFound += checkTile(r+1, c+1); //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";

        // top 3
        checkMine(r-1, c-1);
        checkMine(r-1, c);
        checkMine(r-1, c+1);
        
        //left & right
        checkMine(r, c-1);
        checkMine(r, c+1);

        //bottom 3
        checkMine(r+1, c-1);
        checkMine(r+1, c);
        checkMine(r+1, c+1);
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
    
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}