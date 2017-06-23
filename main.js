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
        source: false,
        sink: false,
        chargeStatus: {
          charged: false,
          chargePhase: null,
          chargeAligned: false,
          spent: false
        }
      }
      tile.channels = generateChannel(tile)
      if (isHidden(tile)) {
        tile.isHidden = true
        tile.channels = null
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
  let source = shuffledCandidates.pop()
  let sourceCoordinates = [source.originRow, source.originCol]
  let sink = shuffledCandidates.pop()
  let sinkCoordinates = [sink.originRow, sink.originCol]
  let distance = distanceCheck(sourceCoordinates, sinkCoordinates)
  while (distance < 4) {
    sink = shuffledCandidates.pop()
    sinkCoordinates = [sink.originRow, sink.originCol]
    distance = distanceCheck(sourceCoordinates, sinkCoordinates)
  }
  source.channels = {
    north: true,
    south: true,
    east: true,
    west: true
  }
  sink.channels = {
    north: true,
    south: true,
    east: true,
    west: true
  }
  source.chargeStatus.charged = true
  source.source = true
  sink.sink = true
  let sourceAndSink = []
  sourceAndSink.push([source.originRow, source.originCol])
  sourceAndSink.push([sink.originRow, sink.originCol])
  return sourceAndSink
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
    else if ((currentCoords[0] === 0 || currentCoords[0] === 7 || currentCoords[1] === 0 || currentCoords[1] === 7) && game.board[currentCoords[0]][currentCoords[1]].sink === true) {
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
    while ((game.board[keepUnblocked[0]][keepUnblocked[1]]).image === 'dead-tile') {
      (game.board[keepUnblocked[0]][keepUnblocked[1]]).channels = generateChannel(game.board[keepUnblocked[0]][keepUnblocked[1]])
    }
  }
  return game.board
}

function distanceCheck(pointA, pointB) {
  let distance = Math.hypot((pointA[1] - pointB[1]), (pointA[0] - pointB[0]))
  return distance
}

function partitionCheck(board) {
  let checkStart = null
  for (let i = 1; i < board.length; i++) {
    for (let j = 1; j < board[i].length; j++) {
      if (!checkStart) {
        if (board[i][j].image !== 'dead-tile') {
          checkStart = [i, j]
        }
      }
    }
  }
  let liveTiles = countLiveTiles(checkStart)
  let deadTiles = countDeadTiles(board)
  if (liveTiles + deadTiles < 36) {
    return true
  }
  return false
}

function hasBeenCounted(tileCoordinates, countedTiles) {
  for (let i = 0; i < countedTiles.length; i++) {
    if (countedTiles[i] && tileCoordinates) {
      if (game.board[tileCoordinates[0]][tileCoordinates[1]] === game.board[countedTiles[i][0]][countedTiles[i][1]]) {
        return true
      }
    }
  }
  return false
}

function countDeadTiles(board) {
  let deadTiles = 0
  for (let i = 1; i < board.length - 1; i++) {
    for (let j = 1; j < board[i].length - 1; j++) {
      if (board[i][j].image === 'dead-tile') {
        deadTiles++
      }
    }
  }
  return deadTiles
}

function countLiveTiles(startingPoint) {
  let countedLiveTiles = []
  let toBeScanned = []
  let currentlyScanningTiles = []
  currentlyScanningTiles.push(startingPoint)
  do {
    let popLength = toBeScanned.length
    for (let k = 0; k < popLength; k++) {
      currentlyScanningTiles.push(toBeScanned.pop())
    }
    for (let i = 0; i < currentlyScanningTiles.length; i++) {
      let adjacent = findAdjacentTiles(currentlyScanningTiles[i])
      for (let j = 0; j < adjacent.length; j++) {
        if (adjacent[j] && countedLiveTiles) {
          if (!(hasBeenCounted(adjacent[j], countedLiveTiles) || hasBeenCounted(adjacent[j], toBeScanned) || hasBeenCounted(adjacent[j], currentlyScanningTiles) || game.board[adjacent[j][0]][adjacent[j][1]].image === 'dead-tile' || game.board[adjacent[j][0]][adjacent[j][1]].sink === true)) {
            toBeScanned.push(adjacent[j])
          }
        }
      }
    }
    popLength = currentlyScanningTiles.length
    for (let n = 0; n < popLength; n++) {
      countedLiveTiles.push(currentlyScanningTiles.pop())
    }
  } while (toBeScanned.length)
  return countedLiveTiles.length
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
  if (tile.source) {
    $tile.classList.add('source')
  }
  if (tile.sink) {
    $tile.classList.add('sink')
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
      if (tiles[i].chargeStatus.charged === true) {
        $tile.classList.add('charged')
        $tileImage.classList.add('charged')
        for (let j = 0; j < 5; j++) {
          if (tiles[i].chargeStatus.chargePhase === j) {
            $tile.classList.add('charge-phase-' + j)
            $tileImage.classList.add('charge-phase-' + j)
          }
        }
      }
      if (tiles[i].chargeStatus.spent === true) {
        $tileImage.classList.add('spent')
        $tile.classList.add('spent')
      }
      $tile.appendChild($tileImage)
    }
    else {
      if (tiles[i].chargeStatus.charged === true) {
        $tile.classList.add('charged')
      }
    }
    $row.appendChild($tile)
  }
  return $row
}

function renderTileImage(tile, $tile) {
  let tileStatus = Object.keys(tile.chargeStatus)
  tileStatus = tileStatus.filter(function (key) {
    return tile.chargeStatus[key] === true
  })
  let $tileImage = new Image(60, 60)
  if (tileStatus.length && tileStatus[0] !== 'charged') {
    $tileImage.src = 'images/' + tileStatus + '-' + tile.image + '.png'
  }
  else {
    $tileImage.src = 'images/' + tile.image + '.png'
  }
  $tileImage.classList.add('channel-render')
  $tileImage.setAttribute('id', 'row-' + $tile.id[4] + ' column-' + $tile.id[13] + ' image')
  $tileImage.imageSmoothingEnabled = false
  return $tileImage
}

function swapTiles(coordinates) {
  let i = coordinates[0]
  let j = coordinates[1]
  let firstSelected = game.board[i[0]][i[1]]
  let secondSelected = game.board[j[0]][j[1]]
  game.board[i[0]][i[1]] = secondSelected
  game.board[j[0]][j[1]] = firstSelected
  game.board[i[0]][i[1]].isSelected = false
  game.board[j[0]][j[1]].isSelected = false
  return game.board
}

function hasClass(element, clsName) {
  return (' ' + element.className + ' ').indexOf(' ' + clsName + ' ') > -1
}

function isInvalidTile(event) {
  return ((hasClass(event.target, 'dead-tile')) || (hasClass(event.target, 'hidden-tile')) || (hasClass(event.target, 'charged')) || (hasClass(event.target, 'spent'))) && ((!(hasClass(event.target, 'board-tile'))) || (!(hasClass(event.target, 'channel-render'))))
}

function getValidChannels(coordinates) {
  let validChannels = Object.keys(game.board[coordinates[0]][coordinates[1]].channels)
  validChannels = validChannels.filter(function (key) {
    return game.board[coordinates[0]][coordinates[1]].channels[key] === true
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
  return tile.chargeStatus.spent === false && tile.chargeStatus.chargeAligned === false && tile.chargeStatus.charged === false && (tile.isHidden === false || tile.sink === true)
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
  for (let i = 0; i < game.board.length; i++) {
    for (let j = 0; j < game.board[i].length; j++) {
      game.board[i][j].chargeStatus.chargeAligned = false
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
        let adjacentTile = game.board[adjacent[validChannels[i]][0]][adjacent[validChannels[i]][1]] // adjacentTile is assigned the value of tile
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

function winCheck(endPoint) {
  if (game.board[endPoint[0]][endPoint[1]].chargeStatus.chargeAligned === true) {
    game.win = true
  }
}

function moveChargeOneTile(chargeCoordinates) {
  let currentChargeCoordinates = chargeCoordinates
  let currentlyChargedTile = game.board[chargeCoordinates[0]][chargeCoordinates[1]]
  let adjacent = findAdjacentTiles(chargeCoordinates)
  let validChannels = getValidChannels(chargeCoordinates)
  for (let i = 0; i < adjacent.length; i++) {
    if (adjacent[validChannels[i]]) {
      let adjacentTile = game.board[adjacent[validChannels[i]][0]][adjacent[validChannels[i]][1]]
      if (adjacentTile.chargeStatus.chargeAligned === true && adjacentTile.chargeStatus.spent === false) {
        currentlyChargedTile.chargeStatus.charged = false
        currentlyChargedTile.chargeStatus.spent = true
        adjacentTile.chargeStatus.chargeAligned = false
        adjacentTile.chargeStatus.charged = true
        currentChargeCoordinates = adjacent[validChannels[i]]
      }
    }
  }
  if (currentChargeCoordinates === chargeCoordinates) {
    game.loss = true
  }
  return currentChargeCoordinates
}

function animateCharge(timer) {
  let $tileImage = document.getElementById('row-' + game.chargeCoordinates[0] + ' column-' + game.chargeCoordinates[1] + ' image')
  let $tile = document.getElementById('row-' + game.chargeCoordinates[0] + ' column-' + game.chargeCoordinates[1])
  let tile = game.board[game.chargeCoordinates[0]][game.chargeCoordinates[1]]
  if (game.loss === true) {
    $tileImage.classList.remove('charge-phase-0')
    $tile.classList.remove('charge-phase-0')
    $tileImage.classList.add('charge-phase-4')
    $tile.classList.add('charge-phase-4')
  }
  if ($tileImage && hasClass($tileImage, 'charged')) {
    if (hasClass($tileImage, ('charge-phase-' + (timer - 1)))) {
      $tileImage.classList.remove('charge-phase-' + timer - 1)
      $tile.classList.remove('charge-phase-' + (timer - 1))
      tile.chargeStatus.chargePhase = timer
      $tileImage.classList.add('charge-phase-' + timer)
      $tile.classList.add('charge-phase-' + timer)
    }
    else {
      $tileImage.classList.add('charge-phase-0')
      $tile.classList.add('charge-phase-0')
      tile.chargeStatus.chargePhase = 0
    }
  }
}

function updateBoardRender(board) {
  findChargePath(game.chargeCoordinates)
  winCheck(game.sink)
  let $board = document.getElementById('board-render')
  $board.removeEventListener('click', selectTile)
  document.getElementById('game-board').removeChild($board)
  $board = renderBoard(board)
  document.getElementById('game-board').appendChild($board)
  $board.addEventListener('click', selectTile)
  return board
}

function generateDemoBoard() {
  let demoTiles = generateTiles()
  let demoBoard = generateBoard(demoTiles)
  let demoGoalCandidates = getGoalCandidates(demoBoard)
  defineGoals(demoGoalCandidates)
  return demoBoard
}

let restartGame = function() {
  let $container = document.getElementById('container')
  let $restart = document.getElementById('restart-button')
  $container.removeChild($restart)
  loadShortCircuit()
}

function startTimer() {
  let $timerText = document.getElementById('timer-text')
  let $countdown = document.getElementById('countdown')
  let $restart = document.createElement('button')
  let $container = document.getElementById('container')
  $restart.classList.add('game-button')
  $restart.setAttribute('id', 'restart-button')
  $restart.addEventListener('click', restartGame)
  if (game.board[game.sink[0]][game.sink[1]].chargeStatus.charged === true) {
    $timerText.textContent = 'Congratulations, you stopped World War III!'
    $restart.textContent = 'Play again?'
    $container.appendChild($restart)
    return
  }
  if (game.loss) {
    $timerText.textContent = 'You couldn\'t fix the circuit! Missiles have been launched!'
    $countdown.textContent = ''
    $restart.textContent = 'Try again?'
    $container.appendChild($restart)
    return
  }
  window.setTimeout(startTimer, 500)
  if (game.win) {
    $timerText.textContent = 'Well done! You restored the circuit!'
    $countdown.textContent = ''
    pushCharge()
  }
  else {
    $timerText.textContent = 'Charge Moves In: '

    game.timer++
    if (game.timer % 2 === 0) {
      $countdown.textContent = (5 - Math.floor(game.timer / 2))
      animateCharge((Math.floor(game.timer / 2)))
    }
    if (game.timer === 10) {
      pushCharge()
      game.timer = 0
      animateCharge(0)
    }
  }
  game.isFirstTurn = false
}

let pushCharge = function(event) {
  game.chargeCoordinates = moveChargeOneTile(game.chargeCoordinates)
  game.board = updateBoardRender(game.board)
}

let startGame = function(event) {
  let $container = document.getElementById('container')
  let $start = document.getElementById('start-button')
  removeEventListener('click', startGame)
  let $instructionsAndDemo = document.getElementById('instructions-and-demo')
  $container.removeChild($start)
  $container.removeChild($instructionsAndDemo)
  game.demo = false
  loadShortCircuit()
}

let selectTile = function(event) {
  if (isInvalidTile(event) || game.win === true || game.loss === true) {
    return
  }
  if (game.isFirstTurn) {
    animateCharge(game.chargeCoordinates)
    startTimer()
  }
  if (game.selectedTiles.length) {
    if (game.board[game.selectedTiles[0][0]][game.selectedTiles[0][1]].chargeStatus.charged) {
      game.selectedTiles = []
    }
  }

  let current = {}
  current = game.board[event.target.id[4]][event.target.id[13]]
  current.isSelected = !current.isSelected
  game.selectedTiles.push([(event.target.id[4]), (event.target.id[13])])
  if (current.isSelected === false) {
    current = 0
    game.selectedTiles = []
  }
  if (game.selectedTiles.length > 1) {
    game.board = swapTiles(game.selectedTiles)
    game.selectedTiles = []
  }
  game.board = updateBoardRender(game.board)
}

function loadShortCircuit() {
  let tiles = generateTiles()
  game.board = generateBoard(tiles)
  let hasPartition = partitionCheck(game.board)

  while (hasPartition) {
    tiles = generateTiles()
    game.board = generateBoard(tiles)
    hasPartition = partitionCheck(game.board)
  }

  let goalCandidates = getGoalCandidates(game.board)
  let sourceAndSink = defineGoals(goalCandidates)
  game.source = sourceAndSink[0]
  game.sink = sourceAndSink[1]

  game.board = checkGoalObstruction(sourceAndSink)

  findChargePath(game.source)

  game.isFirstTurn = true
  game.loss = false
  game.win = false
  game.timer = 0
  if (game.gamesPlayed > 0) {
    let $oldBoard = document.getElementById('board-render')
    let $boardSlot = document.getElementById('game-board')
    $boardSlot.removeChild($oldBoard)
  }
  game.boardRender = renderBoard(game.board)
  let $chargeButtonSlot = document.getElementById('charge-button-slot')
  game.chargeCoordinates = game.source

  game.selectedTiles = []

  let $chargeButton = document.createElement('button')
  $chargeButton.textContent = 'PUSH CHARGE'
  $chargeButton.setAttribute('id', 'charge-button')
  $chargeButton.setAttribute('class', 'game-button')
  let $timerText = document.getElementById('timer-text')
  $timerText.textContent = 'The timer starts when you select a tile.'
  document.getElementById('charge-button-slot').appendChild($chargeButton)
  document.getElementById('game-board').appendChild(game.boardRender)

  $chargeButtonSlot.addEventListener('click', pushCharge)
  game.boardRender.addEventListener('click', selectTile)

  game.gamesPlayed++
}

let game = {
  board: null,
  win: false,
  loss: false,
  demo: true,
  timer: 0,
  chargeCoordinates: null,
  chargePhase: 1,
  source: null,
  sink: null,
  selectedTiles: null,
  isFirstTurn: true,
  gamesPlayed: 0
}

function demoTimer() {
  if (game.demo === true) {
    window.setTimeout(demoTimer, 2500)
    let demoBoard = generateDemoBoard()
    let $demoBoard = renderBoard(demoBoard)
    let $demoBoardSlot = document.getElementById('game-board-demo')
    let $demoBoardRender = document.getElementById('board-render')
    if ($demoBoardRender) {
      $demoBoardSlot.removeChild($demoBoardRender)
    }
    $demoBoardSlot.appendChild($demoBoard)
  }
}

demoTimer()
let $start = document.getElementById('start-button')
$start.addEventListener('click', startGame)
