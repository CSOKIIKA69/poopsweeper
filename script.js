const menu = document.getElementById("menu")
const menuSec = document.getElementById("menu-sec")
const menuGame = document.getElementById("game")
const navBtn = document.getElementById("btn")
const board = document.getElementById('board')
const timeDisp = document.getElementById('time')
const results = document.getElementById('results-container')

let crntMn = 1

let diff = 0

let mines = 0
let cols = 0
let rows = 0

let flags = 0
let timeDat = 0

let clicks = 0
let bv = 0

let revealedCount = 0

let gameOver = false

let datTimeInt

let timerStarted = false

let boardArray = []

document.addEventListener('contextmenu', event => event.preventDefault());

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
        crntMn -= 1;
        clearInterval(datTimeInt)

        timeSec = 0
        timeDat = 0
        gameOver = false

        timerStarted = false

        flags = mines
        
        bv = 0
        board.innerHTML = ''

        timeDisp.innerHTML = 0

        revealedCount = 0
        clicks = 0

        results.style.display = "none"
    } else if (crntMn == 2) {
        menuSec.style.display = "none";
        menu.style.display = "flex";
        crntMn -= 1;
    }
}

function setDiff(n){
    if (n == 1){
        rows = cols = 9
        mines = 10
        flags = 10
    } else if (n == 2){
        rows = 13
        cols = 11
        mines = 22
        flags = 22
    } else {
        rows = 16
        cols = 14
        mines = 35
        flags = 35
    }

    createBoard()
}

function handleTimer() {
    datTimeInt = setInterval(() => {
        timeDat += 1
        timeDisp.innerHTML = Math.round(timeDat/100)
    }, 10)
}

function handleFlagCounter() {
    document.getElementById('flag').innerHTML = flags
}

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
                flagged: false,
                visited: false
            }) 
        
    ))

    handleMines()
    calcNums()
}

function endGame(won){
    clearInterval(datTimeInt)
    gameOver = true

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
            if (!won) {    
                if (boardArray[row][col].flagged && !boardArray[row][col].mine) {
                    cell.style.background = "#b96321"
                    cell.style.borderLeft = "#7e3c16 0.5px solid"
                    cell.style.borderBottom = "#7e3e16 0.5px solid"
                    cell.style.borderRight = "#7e3e16 0.5px solid"
                    cell.style.borderTop = "#7e4516 0.5px solid"
                }
                if (boardArray[row][col].mine && !boardArray[row][col].flagged) {
                    boardArray[cell.dataset.row][cell.dataset.col].revealed = true
                    cell.innerHTML = '<img src="/img/bomb.png" class="bombflag">'
                    cell.style.background = "#a97a1e"
                    cell.style.borderLeft = "#7e5c16 0.5px solid"
                    cell.style.borderBottom = "#7e5c16 0.5px solid"
                    cell.style.borderRight = "#7e5c16 0.5px solid"
                    cell.style.borderTop = "#7e5c16 0.5px solid"
                }
            } else {
                if (boardArray[row][col].mine && !boardArray[row][col].flagged) {
                    boardArray[cell.dataset.row][cell.dataset.col].revealed = true
                    cell.innerHTML = '<img src="/img/flag.png" class="bombflag">'
                    cell.style.background = "#a97a1e"
                    cell.style.borderLeft = "#7e5c16 0.5px solid"
                    cell.style.borderBottom = "#7e5c16 0.5px solid"
                    cell.style.borderRight = "#7e5c16 0.5px solid"
                    cell.style.borderTop = "#7e5c16 0.5px solid"
                }
            }
        }
    }

    if (won) {
        if (mines == 10 ) {
            if (timeDat/100 < localStorage.getItem('pb1') || !localStorage.getItem('pb1')) {localStorage.setItem('pb1', timeDat/100)}
            document.getElementById('result-pb').innerHTML = localStorage.getItem('pb1')
        } else if (mines == 22) {
            if (timeDat/100 < localStorage.getItem('pb2') || !localStorage.getItem('pb2')) {localStorage.setItem('pb2', timeDat/100)}
            document.getElementById('result-pb').innerHTML = localStorage.getItem('pb2')
        } else if (mines == 35) {
            if (timeDat/100 < localStorage.getItem('pb3') || !localStorage.getItem('pb3')) {localStorage.setItem('pb3', timeDat/100)}
            document.getElementById('result-pb').innerHTML = localStorage.getItem('pb3')
        }
    }

    results.style.display = "flex"

    document.getElementById('result-time').innerHTML = timeDat/100
    document.getElementById('result-3bv').innerHTML = bv
    document.getElementById('result-3bvs').innerHTML = ((timeDat/100)/bv).toFixed(4)
    document.getElementById('result-click').innerHTML = clicks
}

function checkWin() {
    if (revealedCount == rows*cols-mines) {
        endGame(true)
    }
}

function revealColor(cell){
    revealedCount += 1

    checkWin()
    
    boardArray[cell.dataset.row][cell.dataset.col].revealed = true

    cell.style.background = "#a97a1e"
    cell.style.borderLeft = "#7e5c16 0.5px solid"
    cell.style.borderBottom = "#7e5c16 0.5px solid"
    cell.style.borderRight = "#7e5c16 0.5px solid"
    cell.style.borderTop = "#7e5c16 0.5px solid"

    let cellNum = boardArray[cell.dataset.row][cell.dataset.col].number
    
    if (cellNum != 0) {
        cell.innerHTML = cellNum

        if (cellNum == 1) {
                cell.style.color = "#7cc7ff"
            } else if (cellNum == 2) {
                cell.style.color = "#66c266"
            } else if (cellNum == 3) {
                cell.style.color = "#ff586c"
            } else if (cellNum == 4) {
                cell.style.color = "#ee88ff"
            } else if (cellNum == 5) {
                cell.style.color = "maroon"
            } else if (cellNum == 6) {
                cell.style.color = "cyan"
            } else if (cellNum == 7) {
                cell.style.color = "black"
            } else if (cellNum == 8) {
                cell.style.color = "grey"
            }
    }
}

function revealEmptyCell(row, col) {
    if (!gameOver) {
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++){
                const neighRow = rowOffset + row
                const neighCol = colOffset + col

                cell = document.querySelector(`[data-row="${neighRow}"][data-col="${neighCol}"]`)

                if (rowOffset === 0 && colOffset === 0 || neighRow < 0 || neighRow >= rows || neighCol < 0 || neighCol >= cols || boardArray[neighRow][neighCol].revealed || boardArray[neighRow][neighCol].flagged) {
                    continue
                } else {
                    revealColor(cell)
                    if (boardArray[neighRow][neighCol].number == 0) {
                        revealEmptyCell(neighRow, neighCol)
                    }
                }
            }
        }
    }
}

function chordCell(row, col){
    console.log('chordCell')
    let flagsCount = 0

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++){
            const neighRow = rowOffset + row
            const neighCol = colOffset + col

            if (rowOffset === 0 && colOffset === 0 || neighRow < 0 || neighRow >= rows || neighCol < 0 || neighCol >= cols) {
                continue
            } else {
                if (boardArray[neighRow][neighCol].flagged) {
                    flagsCount += 1
                }
            }
        }
    }

    console.log(flagsCount, boardArray[row][col].number)

    if (flagsCount === boardArray[row][col].number) {
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++){
                const neighRow = rowOffset + row
                const neighCol = colOffset + col

                if (rowOffset === 0 && colOffset === 0 || neighRow < 0 || neighRow >= rows || neighCol < 0 || neighCol >= cols || boardArray[neighRow][neighCol].flagged || boardArray[neighRow][neighCol].revealed) {
                    continue
                } else {
                    revealCell(document.querySelector(`[data-row="${neighRow}"][data-col="${neighCol}"]`))
                }
            }
        }
    }
}

function revealCell(cell){
    if (gameOver) {
        
    } else if (boardArray[Number(cell.dataset.row)][Number(cell.dataset.col)].revealed) {
        chordCell(Number(cell.dataset.row), Number(cell.dataset.col))
    } else {
        let cellNum = boardArray[Number(cell.dataset.row)][Number(cell.dataset.col)].number
        
        if (boardArray[Number(cell.dataset.row)][Number(cell.dataset.col)].flagged != true) {
            if (timerStarted == false) {
                timerStarted = true
                handleTimer()
            }
            if (boardArray[Number(cell.dataset.row)][Number(cell.dataset.col)].mine) {
                clicks += 1
                endGame(false)
            } else {
                clicks += 1
                revealColor(cell)
                if (cellNum == 0) {
                    revealEmptyCell(Number(cell.dataset.row), Number(cell.dataset.col))
                }
            }
        }
    }
}

function placeFlag(cell) {
    if (!gameOver) {
        cellArray = boardArray[cell.dataset.row][cell.dataset.col]

        if (cellArray.revealed != true) {
            if (cellArray.flagged != true) {
                cellArray.flagged = true
                flags -= 1
                clicks += 1
                cell.innerHTML = '<img src="/img/flag.png" class="bombflag">'
                handleFlagCounter()
            } else {
                flags += 1
                clicks += 1
                cellArray.flagged = false
                cell.innerHTML = ''
                handleFlagCounter()
            }
        }
    }
}

const isMobile = () => {
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  }  
  return /Mobi|Android/i.test(navigator.userAgent);
};

function restartGame() {
    clearInterval(datTimeInt)

    timeSec = 0
    timeDat = 0
    gameOver = false

    timerStarted = false

    flags = mines
    
    bv = 0
    board.innerHTML = ''
    createBoard()

    timeDisp.innerHTML = 0
    handleFlagCounter()

    revealedCount = 0
    clicks = 0

    results.style.display = "none"
}

function exploreZero(row, col) {
    boardArray[row][col].visited = true

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++){

            const neighRow = rowOffset + row
            const neighCol = colOffset + col

            if (rowOffset === 0 && colOffset === 0 || neighRow < 0 || neighRow >= rows || neighCol < 0 || neighCol >= cols || boardArray[neighRow][neighCol].number != 0 || boardArray[neighRow][neighCol].mine || boardArray[neighRow][neighCol].visited) {
                
                continue

            } else {
                
                if (boardArray[neighRow][neighCol].number == 0) {
                    exploreZero(neighRow, neighCol)
                }

            }
        }

    }
}

function tBV() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            
            if (!boardArray[row][col].mine) {
                if (boardArray[row][col].number == 0) {
                    if (!boardArray[row][col].visited) {
                        boardArray[row][col].visited = true
                        bv += 1
                        exploreZero(row, col)
                    }
                } else {
                    let hasZero = false

                    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                        for (let colOffset = -1; colOffset <= 1; colOffset++){

                            const neighRow = rowOffset + row
                            const neighCol = colOffset + col

                            if (rowOffset === 0 && colOffset === 0 || neighRow < 0 || neighRow >= rows || neighCol < 0 || neighCol >= cols || boardArray[neighRow][neighCol].number == 0) {
                                hasZero = true
                            }
                        }
                    }
                    if (!hasZero) {
                        bv += 1
                    }
                }
            }
        }
    }
}

function createBoard() {

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

            if (isMobile()) {
                cell.addEventListener('click', () => {revealCell(cell)})
                cell.addEventListener('long-press', function(e) {
                    placeFlag(cell)
                })
            } else {
                cell.addEventListener('click', () => {
                    revealCell(cell)
                })
                cell.addEventListener('contextmenu', (event) => {
                    event.preventDefault()
                    placeFlag(cell)
                })
            }
        }
    }

    handleFlagCounter()
    tBV()

}