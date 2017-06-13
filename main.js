/* eslint-disable no-unused-vars */

function generateBoard() {
  var $board = document.createElement('div')
  var rows = 8
  for (let i = 0; i < rows; i++) {
    var $row = document.createElement('div')
    $row.setAttribute('class', 'board-row')
    $row.setAttribute('id', 'row-' + i)
    $row.name = 'column-' + i
    for (let j = 0; j < rows; j++) {
      var $tile = document.createElement('div')
      $tile.setAttribute('class', 'board-tile')
      $tile.setAttribute('id', 'row-' + i + ' column-' + j)
      $tile.textContent = 'row-' + i + ' column-' + j
      console.log('row-' + i + ' column-' + j)
      if (i === 0 || i === 7 || j === 0 || j === 7) {
        $tile.classList.add('hidden-tile')
      }
      $row.appendChild($tile)
    }
    $board.appendChild($row)
  }
  return $board
}

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

function generateBoardObject(tiles) {
  var row = []
  var board = []
  var rows = 8
  for (let i = 0; i < rows; i++) {
    row = tiles.splice(0, 8)
    board.push(row)
  }
  return board
}

var $board = generateBoard()
var $start = document.getElementById('start-button')
var $container = document.getElementById('container')

var startGame = function(event) {
  console.log('clicked start')
  document.getElementById('game-board').appendChild($board)
  removeEventListener('click', startGame)
  $container.removeChild($start)
}

$start.addEventListener('click', startGame)
