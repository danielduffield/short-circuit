function generateTiles() {
  let tiles = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let tile = {
        originRow: i,
        originCol: j,
        row: i,
        column: j,
        isSelected: false,
        isHidden: false
      }
      if (tile.row === 0 || tile.row === 7 || tile.column === 0 || tile.column === 7) {
        tile.isHidden = true
      }
      tiles.push(tile)
    }
  }
  return tiles
}

function generateBoard(tiles) {
  let row = []
  let board = []
  let rows = 8
  for (let i = 0; i < rows; i++) {
    row = tiles.splice(0, 8)
    board.push(row)
  }
  return board
}

function renderBoard(board) {
  let $board = document.createElement('div')
  $board.setAttribute('id', 'board-render')
  for (let i = 0; i < board.length; i++) {
    let $row = renderRow(board[i])
    $board.appendChild($row)
  }
  return $board
}

function renderTile(tile) {
  let $tile = document.createElement('div')
  $tile.setAttribute('class', 'board-tile')
  if (tile.isHidden === true) {
    $tile.classList.add('hidden-tile')
  }
  if (tile.isSelected === true) {
    $tile.classList.add('selected')
  }
  $tile.setAttribute('id', 'row-' + tile.row + ' column-' + tile.column)
  $tile.textContent = 'row-' + tile.originRow + ' column-' + tile.originCol
  return $tile
}

function renderRow(tiles) {
  let $row = document.createElement('div')
  $row.setAttribute('class', 'board-row')
  $row.setAttribute('id', 'row-' + tiles[0].row)
  for (let i = 0; i < tiles.length; i++) {
    let $tile = renderTile(tiles[i])
    $row.appendChild($tile)
  }
  return $row
}

function updateBoard(board) {
  let $board = document.getElementById('board-render')
  $board.removeEventListener('click', selectTile)
  document.getElementById('game-board').removeChild($board)
  $board = renderBoard(board)
  document.getElementById('game-board').appendChild($board)
  $board.addEventListener('click', selectTile)
}

function getSelectedTiles(board) {
  let selectedTiles = []
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].isSelected === true) {
        selectedTiles.push(board[i][j])
      }
    }
  }
  return selectedTiles
}

function swapTiles(selectedTiles) {
  let i = selectedTiles[0]
  let j = selectedTiles[1]
  console.log('swap')
  console.log(i)
  console.log(j)
  let tempColumn = i.originCol
  let tempRow = i.originRow
  i.originRow = j.originRow
  i.originCol = j.originCol
  j.originRow = tempRow
  j.originCol = tempColumn
  i.isSelected = false
  j.isSelected = false
}

let board = generateBoard(generateTiles())
let $board = renderBoard(board)
let $start = document.getElementById('start-button')
let $container = document.getElementById('container')

let startGame = function(event) {
  document.getElementById('game-board').appendChild($board)
  removeEventListener('click', startGame)
  $container.removeChild($start)
}

let selectTile = function(event) {
  if (!(event.target.classList[1] === 'hidden-tile') && event.target.classList[0] === 'board-tile') {
    let $current = {}
    $current = board[event.target.id[4]][event.target.id[13]]
    $current.isSelected = !$current.isSelected
    if ($current.isSelected === false) {
      $current = 0
    }
    let selectedTiles = getSelectedTiles(board)
    if (selectedTiles.length > 1) {
      swapTiles(selectedTiles)
    }
    updateBoard(board)
  }
}

$start.addEventListener('click', startGame)
$board.addEventListener('click', selectTile)
