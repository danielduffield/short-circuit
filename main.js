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
        image: null,
        channels: {
          north: false,
          south: false,
          east: false,
          west: false
        },
        goal: null,
        chargeStatus: {
          charged: false,
          chargeAligned: false,
          spent: false
        }
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
      tile.image = 'dead-tile'
      break
    case 1:
      tile.image = 'north-south'
      tile.channels.north = true
      tile.channels.south = true
      break
    case 2:
      tile.image = 'east-west'
      tile.channels.east = true
      tile.channels.west = true
      break
    case 3:
      tile.image = 'north-east'
      tile.channels.north = true
      tile.channels.east = true
      break
    case 4:
      tile.image = 'north-west'
      tile.channels.north = true
      tile.channels.west = true
      break
    case 5:
      tile.image = 'south-east'
      tile.channels.south = true
      tile.channels.east = true
      break
    case 6:
      tile.image = 'south-west'
      tile.channels.south = true
      tile.channels.west = true
      break
    default:
      tile.image = 'null'
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
  start.channels = {
    north: true,
    south: true,
    east: true,
    west: true
  }
  end.channels = {
    north: true,
    south: true,
    east: true,
    west: true
  }
  start.chargeStatus.charged = true
  start.goal = 'start-point'
  end.goal = 'end-point'
  let goalCoordinates = []
  goalCoordinates.push([start.originRow, start.originCol])
  goalCoordinates.push([end.originRow, end.originCol])
  return goalCoordinates
}

function findAdjacentTiles(coords) {
  let adjacentCandidates = []
  let adjacentTiles = []
  let x = coords[0]
  let y = coords[1]
  adjacentCandidates = [
    [x - 1, y], // north
    [x + 1, y], // south
    [x, y + 1], // east
    [x, y - 1] // west
  ]
  for (let i = 0; i < adjacentCandidates.length; i++) {
    let currentCoords = adjacentCandidates[i]
    if (!(currentCoords[0] < 1 || currentCoords[0] > 6 || currentCoords[1] < 1 || currentCoords[1] > 6)) {
      adjacentTiles.push(currentCoords)
    }
    else {
      adjacentTiles.push(null)
    }
  }
  return adjacentTiles
}

function checkGoalObstruction(goalCoordinates) {
  for (let i = 0; i < 2; i++) {
    let adjacent = findAdjacentTiles(goalCoordinates[i])
    let keepUnblocked = []
    for (let j = 0; j < adjacent.length; j++) {
      if (adjacent[j]) {
        keepUnblocked = adjacent[j]
      }
    }
    while ((board[keepUnblocked[0]][keepUnblocked[1]]).image === 'dead-tile') {
      (board[keepUnblocked[0]][keepUnblocked[1]]).channels = generateChannel(board[keepUnblocked[0]][keepUnblocked[1]])
    }
  }
  return board
}

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
      if (tiles[i].isSelected === true) {
        $tileImage.classList.add('selected')
      }
      if (tiles[i].chargeStatus.chargeAligned === true) {
        $tile.classList.add('charge-aligned')
        $tileImage.classList.add('charge-aligned')
      }
      if (tiles[i].image === 'dead-tile') {
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
  $tileImage.src = 'images/channels-rough/' + tile.image + '.png'
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

function getValidChannels(coordinates) {
  let validChannels = Object.keys(board[coordinates[0]][coordinates[1]].channels)
  validChannels = validChannels.filter(function (key) {
    return board[coordinates[0]][coordinates[1]].channels[key] === true
  })
  for (let i = 0; i < validChannels.length; i++) {
    switch (validChannels[i]) {
      case 'north':
        validChannels[i] = 0
        break
      case 'south':
        validChannels[i] = 1
        break
      case 'east':
        validChannels[i] = 2
        break
      case 'west':
        validChannels[i] = 3
    }
  }
  return validChannels
}

function isValidChargePath(tile) {
  return tile.chargeStatus.spent === false && tile.chargeStatus.chargeAligned === false && tile.chargeStatus.charged === false
}

function getOppositeDirection(validChannel) {
  let channelOpposite = null
  switch (validChannel) {
    case 0:
      channelOpposite = 'south'
      break
    case 1:
      channelOpposite = 'north'
      break
    case 2:
      channelOpposite = 'west'
      break
    case 3:
      channelOpposite = 'east'
      break
  }
  return channelOpposite
}

function findChargePath(chargeCoordinates) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].chargeStatus.chargeAligned = false
    }
  }
  let inChargePath = chargeCoordinates
  let lastChargedTile = 0
  while (inChargePath) {
    let adjacent = findAdjacentTiles(inChargePath)
    let validChannels = getValidChannels(inChargePath)
    lastChargedTile = inChargePath
    for (let i = 0; i < validChannels.length; i++) {
      let channelOpposite = getOppositeDirection(validChannels[i])
      if (adjacent[validChannels[i]]) {   // if a tile exists in the direction of a valid channel
        let adjacentTile = board[adjacent[validChannels[i]][0]][adjacent[validChannels[i]][1]] // adjacentTile is assigned the value of tile
        if (isValidChargePath(adjacentTile) && adjacentTile.channels[channelOpposite] === true) { // if adjacentTile is valid/has channel connect
          adjacentTile.chargeStatus.chargeAligned = true // change that tile to be charge aligned
          inChargePath = adjacent[validChannels[i]] // set that tile as the new charge pathfinding start point and re-loop
        }
      }
    }
    if (lastChargedTile === inChargePath) {
      inChargePath = null
    }
  }
}

function moveChargeOneTile(chargeCoordinates) {
  let currentChargeCoordinates = chargeCoordinates
  let currentlyChargedTile = board[chargeCoordinates[0]][chargeCoordinates[1]]
  let adjacent = findAdjacentTiles(chargeCoordinates)
  for (let i = 0; i < adjacent.length; i++) {
    if (adjacent[i]) {
      let adjacentTile = board[adjacent[i][0]][adjacent[i][1]]
      if (adjacentTile.chargeStatus.chargeAligned === true) {
        currentlyChargedTile.chargeStatus.charged = false
        currentlyChargedTile.chargeStatus.spent = true
        adjacentTile.chargeStatus.chargeAligned = false
        adjacentTile.chargeStatus.charged = true
        currentChargeCoordinates = adjacent[i]
      }
    }
  }
  return currentChargeCoordinates
}

let pushCharge = function(event) {
  let $puzzleStart = document.querySelector('.start-point')
  let chargeCoordinates = [parseInt($puzzleStart.id[4], 10), parseInt($puzzleStart.id[13], 10)]
  findChargePath(chargeCoordinates)
  let currentChargeCoordinates = moveChargeOneTile(chargeCoordinates)
  chargeCoordinates = currentChargeCoordinates
}

let startGame = function(event) {
  let $chargeButton = document.createElement('button')
  $chargeButton.textContent = 'PUSH CHARGE'
  $chargeButton.setAttribute('id', 'charge-button')
  $chargeButton.setAttribute('class', 'game-button')
  document.getElementById('charge-button-slot').appendChild($chargeButton)
  document.getElementById('game-board').appendChild($board)
  removeEventListener('click', startGame)
  $container.removeChild($start)
}

let selectTile = function(event) {
  console.log(event.target)
  console.log(board[event.target.id[4]][event.target.id[13]])
  if (isInvalidTile(event)) {
    return
  }
  let current = {}
  current = board[event.target.id[4]][event.target.id[13]]
  current.isSelected = !current.isSelected
  selectedTiles.push([(event.target.id[4]), (event.target.id[13])])
  console.log(current)
  if (current.isSelected === false) {
    current = 0
    selectedTiles = []
  }
  if (selectedTiles.length > 1) {
    board = swapTiles(selectedTiles)
    selectedTiles = []
  }
  let $board = document.getElementById('board-render')
  $board.removeEventListener('click', selectTile)
  document.getElementById('game-board').removeChild($board)
  findChargePath(goalCoordinates[0])
  $board = renderBoard(board)
  document.getElementById('game-board').appendChild($board)
  $board.addEventListener('click', selectTile)
}

let tiles = generateTiles()
let board = generateBoard(tiles)

let goalCandidates = getGoalCandidates(board)

let goalCoordinates = defineGoals(goalCandidates)
board = checkGoalObstruction(goalCoordinates)

findChargePath(goalCoordinates[0])

let $board = renderBoard(board)
let $start = document.getElementById('start-button')
let $chargeButton = document.getElementById('charge-button-slot')
let $container = document.getElementById('container')

let selectedTiles = []

$start.addEventListener('click', startGame)
$chargeButton.addEventListener('click', pushCharge)
$board.addEventListener('click', selectTile)
