function generateTiles() {
  var tiles = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      var tile = {}
      tile.row = i
      tile.column = j
      tile.isHidden = false
      if (tile.row === 0 || tile.row === 7 || tile.column === 0 || tile.column === 7) {
        tile.isHidden = true
      }
      tiles.push(tile)
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

var updateBoard = function(event) {
  console.log(event.target)
}

$start.addEventListener('click', startGame)
$board.addEventListener('click', updateBoard)
