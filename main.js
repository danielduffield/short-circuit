/* eslint-disable no-unused-vars */

function generateTiles() {
  let tiles = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let tile = {
        originRow: i,
        originCol: j,
        isSelected: false,
        isHidden: false
      }
      if (tile.originRow === 0 || tile.originRow === 7 || tile.originCol === 0 || tile.originCol === 7) {
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
    let $row = renderRow(board[i], i)
    $row.setAttribute('id', 'row-' + i)
    $board.appendChild($row)
  }
  return $board
}

function renderTile(tile, rowNum) {
  let $tile = document.createElement('div')
  $tile.setAttribute('class', 'board-tile')
  if (tile.isHidden === true) {
    $tile.classList.add('hidden-tile')
  }
  if (tile.isSelected === true) {
    $tile.classList.add('selected')
  }
  $tile.textContent = 'row-' + tile.originRow + ' column-' + tile.originCol
  return $tile
}

function renderRow(tiles, rowNum) {
  let $row = document.createElement('div')
  $row.setAttribute('class', 'board-row')

  for (let i = 0; i < tiles.length; i++) {
    let $tile = renderTile(tiles[i], rowNum)
    $tile.setAttribute('id', 'row-' + rowNum + ' column-' + i)
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
  let tempColumn = i.originCol
  let tempRow = i.originRow
  i.originRow = j.originRow
  i.originCol = j.originCol
  j.originRow = tempRow
  j.originCol = tempColumn
  i.isSelected = false
  j.isSelected = false
}

function swapTiles2(coordinates) {
  let i = coordinates[0]
  let j = coordinates[1]
  console.log(i[0], i[1])
  console.log(j[0], j[1])
  let firstSelected = board[i[0]][i[1]]
  let secondSelected = board[j[0]][j[1]]
  board[i[0]][i[1]] = secondSelected
  board[j[0]][j[1]] = firstSelected
  board[i[0]][i[1]].isSelected = false
  board[j[0]][j[1]].isSelected = false
  return board
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
    selectedList.push([(event.target.id[4]), (event.target.id[13])])
    console.log(selectedList)
    if ($current.isSelected === false) {
      $current = 0
      selectedList = []
    }
    let selectedTiles = getSelectedTiles(board)
    if (selectedTiles.length > 1) {
      swapTiles2(selectedList)
      selectedList = []
    }
    updateBoard(board)
  }
}

let selectedList = []
$start.addEventListener('click', startGame)
$board.addEventListener('click', selectTile)
