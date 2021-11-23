'use strict'
const WALL = `<div class="wall"></div>`
const FOOD = `<div class="pacman-food"></div>`
const EMPTY = ' ';
const SUPER_FOOD = `<div class="super-food"></div>`
const CHERRY = '🍒'



var gBoard;
var gFoodToEat
var gGame
var gPlaceCherryInterval

function init() {
    gBoard = buildBoard()
    createPacman(gBoard);
    gFoodToEat = getFoodCount(gBoard)
    createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    gGame = {
        score: 0,
        isOn: true
    }
    gPlaceCherryInterval = setInterval(placeCherry, 15000)

}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
            }
            if ((i === 1 || i === SIZE - 2) && (j === 1 || j === SIZE - 2)) {
                board[i][j] = SUPER_FOOD
            }
        }
    }
    return board;
}

function placeCherry() {
    var randomCell = getRandomEmptyCell()
    if (!randomCell) return
    gBoard[randomCell.i][randomCell.j] = CHERRY
    renderCell(randomCell, CHERRY)
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

function updateScore(diff) {
    gGame.score += diff;
    if (diff === 0) gGame.score = 0
    document.querySelector('h2 span').innerText = gGame.score
}

function gameOver(isVictory) {
    gGame.isOn = false;
    clearInterval(gIntervalGhosts)
    clearTimeout(gSuperModeTimeout)
    clearInterval(gPlaceCherryInterval)
    openModal(isVictory)
}

function restart() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    updateScore(0)
    init()
}

function openModal(isVictory) {
    var elModal = document.querySelector('.modal')
    var elModalSpan = elModal.querySelector('span')
    elModalSpan.innerText = isVictory ? 'Victorious!! You Are Number One ' : 'Game Over'
    elModal.style.display = 'flex'
}

function getFoodCount(board) {
    var countFood = 0
    for (var i = 0; i < board.length - 1; i++) {
        for (var j = 0; j < board[0].length - 1; j++) {
            if (board[i][j] === FOOD) countFood++
        }

    }
    return countFood
}
