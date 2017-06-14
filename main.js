function generateTiles() {
  var tiles = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      var tile = {}
      tile.row = i
      tile.column = j
      tile.isSelected = false
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
  $board.setAttribute('id', 'board-render')
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
  if (tile.isSelected === true) {
    $tile.classList.add('selected')
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

function updateBoard(board) {
  var $board = document.getElementById('board-render')
  $board.removeEventListener('click', selectTile)
  document.getElementById('game-board').removeChild($board)
  $board = renderBoard(board)
  document.getElementById('game-board').appendChild($board)
  $board.addEventListener('click', selectTile)
}

function swapTiles(board) {
  var selectedTiles = []
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].isSelected === true) {
        selectedTiles.push(board[i][j])
      }
    }
  }
  if (selectedTiles.length > 1) {
    let i = selectedTiles[0]
    let j = selectedTiles[1]
    let tempColumn = i.column
    let tempRow = i.row
    i.row = j.row
    i.column = j.column
    j.row = tempRow
    j.column = tempColumn
    i.isSelected = false
    j.isSelected = false
  }
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

var selectTile = function(event) {
  if (!(event.target.classList[1] === 'hidden-tile') && event.target.classList[0] === 'board-tile') {
    console.log(event.target)
    var $current = board[event.target.id[4]][event.target.id[13]]
    $current.isSelected = !$current.isSelected
    console.log($current)
    swapTiles(board)
    updateBoard(board)
  }
}

$start.addEventListener('click', startGame)
$board.addEventListener('click', selectTile)
