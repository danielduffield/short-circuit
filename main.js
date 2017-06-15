/* eslint-disable no-unused-vars */

function generateTiles() {
  let tiles = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let tile = {
        originRow: i,
        originCol: j,
        isSelected: false,
        isHidden: false,
        channels: null,
        goal: null
      }
      if (isHidden(tile)) {
        tile.isHidden = true
      }
      tile.channels = generateChannel(tile)
      tiles.push(tile)
    }
  }
  return tiles
}

function isHidden(tile) {
  return tile.originRow === 0 || tile.originRow === 7 || tile.originCol === 0 || tile.originCol === 7
}

function isHiddenCorner(tile) {
  return (tile.originRow === 0 && tile.originCol === 0) || (tile.originRow === 0 && tile.originCol === 7) || (tile.originRow === 7 && tile.originCol === 7) || (tile.originRow === 7 && tile.originCol === 0)
}

function getGoalCandidates(board) {
  let candidates = []
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (isHidden(board[i][j]) && !isHiddenCorner(board[i][j])) {
        candidates.push(board[i][j])
      }
    }
  }
  return candidates
}

function generateChannel(tile) {
  let random = Math.floor(Math.random() * 7)
  switch (random) {
    case 0:
      tile.channels = 'dead-tile'
      break
    case 1:
      tile.channels = 'north-south'
      break
    case 2:
      tile.channels = 'east-west'
      break
    case 3:
      tile.channels = 'north-east'
      break
    case 4:
      tile.channels = 'north-west'
      break
    case 5:
      tile.channels = 'south-east'
      break
    case 6:
      tile.channels = 'south-west'
      break
    default:
      tile.channels = 'null'
  }
  return tile.channels
}

function shuffleArray(array) {
  let shuffled = array.slice()
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

function defineGoals(candidates) {
  let shuffledCandidates = shuffleArray(candidates)
  let start = shuffledCandidates.pop()
  let end = shuffledCandidates.pop()
  let distance = distanceCheck(start, end)
  while (distance < 4) {
    end = shuffledCandidates.pop()
    distance = distanceCheck(start, end)
  }
  start.goal = 'start-point'
  end.goal = 'end-point'
  return board
}

function findAdjacentTiles(coords) {
  let adjacentCandidates = []
  let adjacentTiles = []
  let y = coords[0]
  let x = coords[1]
  adjacentCandidates = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1]
  ]
  console.log('adjacentCandidates', adjacentCandidates)
  for (let i = 0; i < adjacentCandidates.length; i++) {
    let currentCoords = adjacentCandidates[i]
    if (!(currentCoords[0] < 1 || currentCoords[0] > 6 || currentCoords[1] < 1 || currentCoords[1] > 6)) {
      adjacentTiles.push(currentCoords)
    }
  }
  return adjacentTiles
}

/*
function checkGoalBlockage(goals) {
  let startCoords = []
  let endCoords = []
  startCoords.push(goals[0].originRow)
  startCoords.push(goals[0].originCol)
  endCoords.push(goals[1].originRow)
  endCoords.push(goals[1].originCol)
}

*/

function distanceCheck(start, end) {
  let distance = Math.hypot((start.originCol - end.originCol), (start.originRow - end.originRow))
  return distance
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
  if (tile.goal) {
    $tile.classList.add(tile.goal)
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
    if (!isHidden(tiles[i])) {
      let $tileImage = renderTileImage(tiles[i], $tile)
      if (tiles[i].channels === 'dead-tile') {
        $tileImage.classList.add('dead-tile')
        $tile.classList.add('dead-tile')
      }
      $tile.appendChild($tileImage)
    }
    $row.appendChild($tile)
  }
  return $row
}

function renderTileImage(tile, $tile) {
  let $tileImage = new Image(60, 60)
  $tileImage.src = 'images/channels-rough/' + tile.channels + '.png'
  $tileImage.classList.add('channel-render')
  $tileImage.setAttribute('id', 'row-' + $tile.id[4] + ' column-' + $tile.id[13] + ' image')
  return $tileImage
}

function swapTiles(coordinates) {
  let i = coordinates[0]
  let j = coordinates[1]
  let firstSelected = board[i[0]][i[1]]
  let secondSelected = board[j[0]][j[1]]
  board[i[0]][i[1]] = secondSelected
  board[j[0]][j[1]] = firstSelected
  board[i[0]][i[1]].isSelected = false
  board[j[0]][j[1]].isSelected = false
  return board
}

function isInvalidTile(event) {
  return (event.target.classList[1] === 'dead-tile') || (event.target.classList[1] === 'hidden-tile') || (!(event.target.classList[0] === 'board-tile') && !(event.target.classList[0] === 'channel-render'))
}

let startGame = function(event) {
  document.getElementById('game-board').appendChild($board)
  removeEventListener('click', startGame)
  $container.removeChild($start)
}

let selectTile = function(event) {
  if (isInvalidTile(event)) {
    return
  }
  let $current = {}
  $current = board[event.target.id[4]][event.target.id[13]]
  $current.isSelected = !$current.isSelected
  selectedTiles.push([(event.target.id[4]), (event.target.id[13])])
  console.log($current)
  if ($current.isSelected === false) {
    $current = 0
    selectedTiles = []
  }
  if (selectedTiles.length > 1) {
    board = swapTiles(selectedTiles)
    selectedTiles = []
  }
  let $board = document.getElementById('board-render')
  $board.removeEventListener('click', selectTile)
  document.getElementById('game-board').removeChild($board)
  $board = renderBoard(board)
  document.getElementById('game-board').appendChild($board)
  $board.addEventListener('click', selectTile)
}

let tiles = generateTiles()
let board = generateBoard(tiles)

let goalCandidates = getGoalCandidates(board)

board = defineGoals(goalCandidates)

let $board = renderBoard(board)
let $start = document.getElementById('start-button')
let $container = document.getElementById('container')

let selectedTiles = []

$start.addEventListener('click', startGame)
$board.addEventListener('click', selectTile)
