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

function generateChannels(tiles) {
  for (let i = 0; i < tiles.length; i++) {
    let random = Math.floor(Math.random() * 7)
    switch (random) {
      case 0:
        tiles[i].channels = 'dead-tile'
        break
      case 1:
        tiles[i].channels = 'north-south'
        break
      case 2:
        tiles[i].channels = 'east-west'
        break
      case 3:
        tiles[i].channels = 'north-east'
        break
      case 4:
        tiles[i].channels = 'north-west'
        break
      case 5:
        tiles[i].channels = 'south-east'
        break
      case 6:
        tiles[i].channels = 'south-west'
        break
      default:
        tiles[i].channels = 'null'
    }
  }
  return tiles
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
  let goals = []
  goals.push(start)
  goals.push(end)
  return goals
}

function distanceCheck(start, end) {
  let distance = Math.hypot((start.originCol - end.originCol), (start.originRow - end.originRow))
  return distance
}

function renderGoals(goals) {
  goals[0].goal = 'start-point'
  goals[1].goal = 'end-point'
  return board
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
  if (!isHidden(tile)) {
    let $tileImage = renderTileImage(tile)
    $tile.appendChild($tileImage)
  }
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

function renderTileImage(tile) {
  let $tileImage = new Image(60, 60)
  $tileImage.src = 'images/channels-rough/' + tile.channels + '.png'
  $tileImage.classList.add('channel-render')
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
  return ((event.target.classList[1] === 'hidden-tile') || !(event.target.classList[0] === 'board-tile'))
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
  console.log($current)
  selectedTiles.push([(event.target.id[4]), (event.target.id[13])])
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
tiles = generateChannels(tiles)
let board = generateBoard(tiles)

let goalCandidates = getGoalCandidates(board)
let goals = defineGoals(goalCandidates)
board = renderGoals(goals)

let $board = renderBoard(board)
let $start = document.getElementById('start-button')
let $container = document.getElementById('container')

let selectedTiles = []

$start.addEventListener('click', startGame)
$board.addEventListener('click', selectTile)
