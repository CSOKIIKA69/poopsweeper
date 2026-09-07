const menu = document.getElementById("menu")
const menuSec = document.getElementById("menu-sec")
const menuGame = document.getElementById("game")
const navBtn = document.getElementById("btn")
const board = document.getElementById('board')

let crntMn = 1

let diff = 0

let mines = 0
let cols = 0
let rows = 0

function forwardMenu() {
    if (crntMn == 1) {
        menu.style.display = "none";
        menuSec.style.display = "flex";
        crntMn += 1;
    } else if (crntMn == 2) {
        menuSec.style.display = "none";
        menuGame.style.display = "flex";
        crntMn += 1;
    }
}

function backMenu() {
    if (crntMn == 3) {
        menuGame.style.display = "none";
        menuSec.style.display = "flex";
        crntMn -= 1
    } else if (crntMn == 2) {
        menuSec.style.display = "none";
        menu.style.display = "flex";
        crntMn -= 1;
    }
}

function setDiff(n){
    if (n == 1){
        rows = 9
        cols = 9
        mines = 10
    } else if (n == 2){
        rows = 13
        cols = 11
        mines = 22
    } else {
        rows = 16
        cols = 14
        mines = 35
    }
}

function handleTimer() {}

function handleFlagCounter() {}

function createBoard() {
    const boardArray = Array.from(
        { length: rows },
        () => new Array(cols).fill({
            mine: false,
            number: 0,
            revealed: false,
            flagged: false
        })
    );
    console.log(boardArray, cols, rows, mines);

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const row = document.createElement('div')
        row.classList.add(`row`, rowIndex)
        board.appendChild(row)
        console.log(`row n. ${rowIndex} created`)

        for (let colIndex = 0; colIndex < cols; colIndex++) {
            const cell = document.createElement('div')
            cell.classList.add('cell', colIndex)
            row.appendChild(cell)
            console.log(`cell n. ${colIndex} created`)
        }
    }

}