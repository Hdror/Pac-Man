'use strict'
const PACMAN = '😷';

var gPacman;
var gSuperModeTimeout

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}
function movePacman(ev) {

    if (!gGame.isOn) return;
    var nextLocation = getNextLocation(ev)
    if (!nextLocation) return;
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    console.log('NEXT CELL', nextCell);
    switch (nextCell) {
        case WALL:
            return
        case FOOD:
            updateScore(1)
            gFoodToEat--
            break
        case SUPER_FOOD:
            console.log(gPacman.isSuper);
            if (gPacman.isSuper) return
            superMode()
            break
        case CHERRY:
            updateScore(10)
            break
        case GHOST:
            if (gPacman.isSuper) {
                removeGhost(nextLocation)
                break
            } else {
                gameOver()
                renderCell(gPacman.location, EMPTY)
                return
            }
    }
    // if (nextCell === WALL) return;
    // if (nextCell === FOOD) {
    //     updateScore(1);
    //     gFoodToEat--
    // }
    // else if (nextCell === GHOST) {
    //     gameOver(false)
    //     renderCell(gPacman.location, EMPTY)
    //     return;
    // }

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

    // update the dom
    renderCell(gPacman.location, EMPTY);

    gPacman.location = nextLocation;

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // update the dom
    renderCell(gPacman.location, PACMAN);
    if (!gFoodToEat) gameOver(true)

}

function superMode() {
    gPacman.isSuper = true
    changeGhostColor()
    gSuperModeTimeout = setTimeout(() => {
        gPacman.isSuper = false
        resetGhosts()
        changeGhostColor()
    }, 5000);
}


function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
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