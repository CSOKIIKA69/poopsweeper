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

let boardArray = []

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

function handleMines() {
    for (i = 0; i < mines; i++) {
        let randomCol = Math.floor(Math.random() * cols)
        let randomRow = Math.floor(Math.random() * rows)

        while (boardArray[randomRow][randomCol].mine == true) {
            randomCol = Math.floor(Math.random() * cols)
            randomRow = Math.floor(Math.random() * rows)
        }

        boardArray[randomRow][randomCol].mine = true
    }
}

function calcNums() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let mineCount = 0

            for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                for (let colOffset = -1; colOffset <= 1; colOffset++){
                    const neighRow = rowOffset + row
                    const neighCol = colOffset + col

                    if (rowOffset === 0 && colOffset === 0 || neighRow < 0 || neighRow >= rows || neighCol < 0 || neighCol >= cols) {
                        continue
                    } else {
                        // console.log(boardArray[neighRow][neighCol])
                        if (boardArray[neighRow][neighCol].mine) {
                            mineCount++
                        }
                    }
                }
            }

            boardArray[row][col].number = mineCount

        }
    }
}

function createArray() {
    boardArray = Array.from(
        {length: rows},
        () => Array.from(
            {length: cols},
            () => ({
                mine: false,
                number: 0,
                revealed: false,
                flagged: false
            }) 
        
    ))

    handleMines()
    calcNums()
}

function endGame(){
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (boardArray[row][col].mine) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
                cell.innerHTML = '<img src="/img/bomb.png" class="bomb">'
            }
        }
    }
}

function revealEmptyCell(row, col) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {

            for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                for (let colOffset = -1; colOffset <= 1; colOffset++){
                    const neighRow = rowOffset + row
                    const neighCol = colOffset + col

                    if (rowOffset === 0 && colOffset === 0 || neighRow < 0 || neighRow >= rows || neighCol < 0 || neighCol >= cols || boardArray[neighRow][neighCol].revealed) {
                        continue
                    } else {
                        
                    }
                }
            }
        }
    }
}

function revealCell(cell){
    if (boardArray[cell.dataset.row][cell.dataset.col].mine) {
        endGame()
    } else {
        boardArray[cell.dataset.row][cell.dataset.col].revealed = true
        if (boardArray[cell.dataset.row][cell.dataset.col].number == 0) {
            cell.style.background = "#a97a1e"
            cell.style.borderLeft = "#7e5c16 0.5px solid"
            cell.style.borderBottom = "#7e5c16 0.5px solid"
            cell.style.borderRight = "#7e5c16 0.5px solid"
            cell.style.borderTop = "#7e5c16 0.5px solid"
        } else {
            cell.innerHTML = boardArray[cell.dataset.row][cell.dataset.col].number
            cell.style.background = "#a97a1e"
            cell.style.borderLeft = "#7e5c16 0.5px solid"
            cell.style.borderBottom = "#7e5c16 0.5px solid"
            cell.style.borderRight = "#7e5c16 0.5px solid"
            cell.style.borderTop = "#7e5c16 0.5px solid"
            if (cell.dataset.number == 1) {
                cell.style.color = "#7cc7ff"
            } else if (cell.dataset.number == 2) {
                cell.style.color = "#66c266"
            } else if (cell.dataset.number == 3) {
                cell.style.color = "#ff586c"
            } else if (cell.dataset.number == 4) {
                cell.style.color = "#ee88ff"
            } else if (cell.dataset.number == 5) {
                cell.style.color = "maroon"
            } else if (cell.dataset.number == 6) {
                cell.style.color = "cyan"
            } else if (cell.dataset.number == 7) {
                cell.style.color = "black"
            } else {
                cell.styel.color = "grey"
            }
        }
        
    }
}

function placeFlag(cell) {

}

function createBoard(n) {

    setDiff(n)

    createArray()
    
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const row = document.createElement('div')
        row.classList.add(`row`, rowIndex)
        board.appendChild(row)

        for (let colIndex = 0; colIndex < cols; colIndex++) {
            const cell = document.createElement('div')
            cell.classList.add('cell', colIndex)
            row.appendChild(cell)
            cell.dataset.row = rowIndex
            cell.dataset.col = colIndex

            cell.addEventListener("mousedown", event => {
                if (event.button == 0) {
                    revealCell(cell)
                } else if (event.button == 2) {
                    placeFlag(cell)
                }
            })
        }
    }
}