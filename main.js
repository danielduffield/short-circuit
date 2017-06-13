function Tile(row, column, isHidden) {
  this.row = row
  this.column = column
  if (row === 0 || row === 7 || column === 0 || column === 7) {
    isHidden = true
  }
  else {
    isHidden = false
  }
}

function generateTiles() {
  this.row = [0, 1, 2, 3, 4, 5, 6, 7]
  this.column = [0, 1, 2, 3, 4, 5, 6, 7]
  var tiles = []

  for (let i = 0; i < this.row.length; i++) {
    for (let j = 0; j < this.column.length; j++) {
      tiles.push(new Tile(this.row[i], this.column[j]))
    }
  }
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].row === 0 || tiles[i].row === 7 || tiles[i].column === 0 || tiles[i].column === 7) {
      tiles[i].isHidden = true
    }
    else {
      tiles[i].isHidden = false
    }
  }
  return tiles
}

function generateBoard(tiles) {
  var row = []
  var board = []
  var rows = 8
  for (let i = 0; i < rows; i++) {
    row = tiles.splice(0, 8)
    board.push(row)
  }
  return board
}

function renderBoard(board) {
  var $board = document.createElement('div')
  for (let i = 0; i < board.length; i++) {
    var $row = renderRow(board[i])
    $board.appendChild($row)
  }
  return $board
}

function renderTile(tile) {
  var $tile = document.createElement('div')
  $tile.setAttribute('class', 'board-tile')
  if (tile.isHidden === true) {
    $tile.classList.add('hidden-tile')
  }
  $tile.setAttribute('id', 'row-' + tile.row + ' column-' + tile.column)
  $tile.textContent = 'row-' + tile.row + ' column-' + tile.column
  return $tile
}

function renderRow(tiles) {
  var $row = document.createElement('div')
  $row.setAttribute('class', 'board-row')
  $row.setAttribute('id', 'row-' + tiles[0].row)
  for (let i = 0; i < tiles.length; i++) {
    var $tile = renderTile(tiles[i])
    $row.appendChild($tile)
  }
  return $row
}

var board = generateBoard(generateTiles())
var $board = renderBoard(board)
var $start = document.getElementById('start-button')
var $container = document.getElementById('container')

var startGame = function(event) {
  console.log('clicked start')
  document.getElementById('game-board').appendChild($board)
  removeEventListener('click', startGame)
  $container.removeChild($start)
}

$start.addEventListener('click', startGame)
