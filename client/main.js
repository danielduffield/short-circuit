const generateTiles = require('./utils/generate-tiles.js')
const getGoalCandidates = require('./utils/get-goal-candidates.js')
const defineGoals = require('./utils/define-goals.js')
const checkGoalObstruction = require('./utils/check-goal-obstruction.js')
const partitionCheck = require('./utils/partition-check.js')
const generateBoard = require('./utils/generate-board.js')
const renderBoard = require('./utils/render-board.js')
const swapTiles = require('./utils/swap-tiles.js')
const findChargePath = require('./utils/find-charge-path.js')
const moveChargeOneTile = require('./utils/move-charge-one-tile.js')
const animateCharge = require('./utils/animate-charge.js')
const hasClass = require('./utils/has-class.js')
const demoTimer = require('./utils/demo-timer.js')
const getSpannedTitle = require('./utils/get-spanned-title.js')
const replaceTitleWithSpanned = require('./utils/replace-title-with-spanned.js')

function isInvalidTile(event) {
  return ((hasClass(event.target, 'dead-tile')) || (hasClass(event.target, 'hidden-tile')) || (hasClass(event.target, 'charged')) || (hasClass(event.target, 'spent'))) && ((!(hasClass(event.target, 'board-tile'))) || (!(hasClass(event.target, 'channel-render'))))
}

function winCheck(endPoint) {
  if (game.board[endPoint[0]][endPoint[1]].chargeStatus.chargeAligned === true) {
    game.win = true
  }
}

function updateBoardRender(board) {
  findChargePath(game.board, game.chargeCoordinates)
  winCheck(game.sink)
  let $board = document.getElementById('board-render')
  $board.removeEventListener('click', selectTile)
  document.getElementById('game-board').removeChild($board)
  $board = renderBoard(board)
  document.getElementById('game-board').appendChild($board)
  $board.addEventListener('click', selectTile)
  return board
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
  game = moveChargeOneTile(game)
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
    game.board = swapTiles(game.board, game.selectedTiles)
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

  game.board = checkGoalObstruction(game.board, sourceAndSink)

  findChargePath(game.board, game.source)

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

function animateTitleForward() {
  if (cycles > 41) {
    let $lastLetter = document.getElementById('span-20')
    if ($lastLetter.classList.length) {
      $lastLetter.classList.remove('charged')
    }
    return
  }
  window.setTimeout(animateTitleForward, 100)
  if (letterIndex === 0) {
    let $lastLetter = document.getElementById('span-20')
    if ($lastLetter.classList.length) {
      $lastLetter.classList.remove('charged')
    }
  }
  if (letterIndex - 1 >= 0) {
    let $lastLetter = document.getElementById('span-' + (letterIndex - 1))
    $lastLetter.classList.remove('charged')
  }
  let $currentLetter = document.getElementById('span-' + letterIndex)
  $currentLetter.classList.add('charged')
  letterIndex++
  if (letterIndex === 21) {
    if (cycles > 40) {
      letterIndex = 20
    }
    else {
      letterIndex = 0
    }
  }
  cycles++
}

function animateTitleBackward() {
  if (cycles < 1) {
    let $lastLetter = document.getElementById('span-0')
    if ($lastLetter.classList.length) {
      $lastLetter.classList.remove('charged')
    }
    return
  }
  window.setTimeout(animateTitleBackward, 100)
  if (letterIndex === 20) {
    let $lastLetter = document.getElementById('span-0')
    if ($lastLetter.classList.length) {
      $lastLetter.classList.remove('charged')
    }
  }
  if (letterIndex + 1 <= 20) {
    let $lastLetter = document.getElementById('span-' + (letterIndex + 1))
    $lastLetter.classList.remove('charged')
  }
  let $currentLetter = document.getElementById('span-' + letterIndex)
  $currentLetter.classList.add('charged')
  letterIndex--
  if (letterIndex === -1) {
    if (cycles === 1) {
      letterIndex = 0
    }
    else {
      letterIndex = 20
    }
  }
  cycles--
}

function replaceSpannedWithTitle() {
  let $title = document.createElement('h1')
  let $spannedTitle = document.getElementById('animated-title')
  $title.textContent = '/-/ SH0RT.C1RCU1T /+/'
  $title.setAttribute('id', 'main-title')
  let $titleContainer = document.getElementById('title-container')
  $titleContainer.removeChild($spannedTitle)
  $titleContainer.appendChild($title)
}

function reloadTitle() {
  let $title = document.getElementById('animated-title')
  let $titleContainer = document.getElementById('title-container')
  $titleContainer.removeChild($title)
  $titleContainer.appendChild($title)
}

let letterIndex = 0
let cycles = 0

replaceTitleWithSpanned(getSpannedTitle())
window.setTimeout(animateTitleForward, 4000)
window.setTimeout(reloadTitle, 8500)
window.setTimeout(animateTitleBackward, 12500)
window.setTimeout(reloadTitle, 17000)
window.setTimeout(replaceSpannedWithTitle, 21000)

demoTimer(game)
let $start = document.getElementById('start-button')
$start.addEventListener('click', startGame)
