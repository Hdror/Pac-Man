//not included the max!!!!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function getRandomEmptyCell() {
    var emptyCells = getRandomEmptyCells()
    return emptyCells.pop()
}

function getRandomEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length - 1; i++) {
        for (var j = 0; j < gBoard[0].length - 1; j++) {
            if (gBoard[i][j] === EMPTY) {
                emptyCells.push({ i, j })
            }
        }
    }
    return shuffle(emptyCells)
}

function shuffle(items) {
    var randIdx, keep, i
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length)
        keep = items[i]
        items[i] = items[randIdx]
        items[randIdx] = keep
    }
    return items
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

// render cell with data
function renderCell(cellI, cellJ, value) {
    var elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    console.log('elCell:', elCell);
    elCell.innerText = value
}

//render cell with class ,location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

//open modal,boolean value win/loss
function openModal(isVictory) {
    var elModal = document.querySelector('.modal')
    var elModalSpan = elModal.querySelector('span')
    elModalSpan.innerText = isVictory ? 'Victorious!! You Are Number One ' : 'Game Over'
    elModal.style.display = 'flex'
}

// restart button with score updating
function restart() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    updateScore(0)
    init()
}

//updating score, calling from restart function
function updateScore(diff) {
    gGame.score += diff;
    if (diff === 0) gGame.score = 0
    document.querySelector('h2 span').innerText = gGame.score
}

// random movment of items
function getMoveDiff() {
    var randNum = getRandomInt(0, 100);
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

// find next location of player by keyboard event sanding from other function
function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: player.location.i,
        j: player.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            break;
        case 'ArrowDown':
            nextLocation.i++;
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            break;
        case 'ArrowRight':
            nextLocation.j++;
            break;
        default:
            return null;
    }
    return nextLocation;
}

// geting keyboard event, calling by onkeyup directily
function handleKey(event) {
	var i = gGamerPos.i
	var j = gGamerPos.j
switch (event.key) {

		case 'ArrowLeft':
			var posJ = (j === 0) ? (gBoard[0].length - 1) : j - 1
			moveTo(i, posJ)
			break
		case 'ArrowRight':
			var posJ = (j === gBoard[0].length - 1) ? 0 : j + 1
			moveTo(i, posJ)
			break
		case 'ArrowUp':
			var posI = (i === 0) ? (gBoard.length - 1) : i - 1
			moveTo(posI, j)
			break
		case 'ArrowDown':
			var posI = (i === gBoard.length - 1) ? 0 : i + 1
			moveTo(posI, j)
			break

	}

}

// moving player to target cell, calling from handle key function
function moveTo(i, j) {
	if (gIsGameOver) return
	var targetCell = gBoard[i][j]
	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i)
	var jAbsDiff = Math.abs(j - gGamerPos.j)

	if (iAbsDiff + jAbsDiff === 1 ){
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
		renderCell(gGamerPos, '')
		gGamerPos.i = i
		gGamerPos.j = j
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER
		renderCell(gGamerPos, GAMER_IMG)

	}

}

// setting timer
function startTime() {
    var gStartTime = Date.now();
    var elTimer = document.querySelector('.timer');
    gTimerInterval = setInterval(function () {
        var passedSeconds = Math.floor((Date.now() - gStartTime) / 1000);
        elTimer.innerText = passedSeconds;
    }, 100);
}
function stopTime() {
    clearInterval(gTimerInterval);
}

//count neighbors getting location and board 
function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++;
        }
    }
    return neighborsCount;
}

// good for game of life,need refactor@@@@@
function runGeneration(board) {
    var newBoard = copyMat(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var numOfNeighbors = countNeighbors(i, j, board);

            if ((numOfNeighbors > 2) && (numOfNeighbors < 6)) {
                if (board[i][j] === '') newBoard[i][j] = LIFE;
            }
            else if (board[i][j] === LIFE) newBoard[i][j] = '';
        }
    }
    return newBoard;
}

//all neighbors cell tern empty 
function blowUpNegs(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j] === LIFE) {
                //model
                mat[i][j] = ''
                //dom
                renderCell(i, j, '')



            }
        }
    }
    console.table(gBoard)


}