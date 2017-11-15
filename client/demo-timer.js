const generateDemoBoard = require('./generate-demo-board.js')
const renderBoard = require('./render-board.js')

function demoTimer(game) {
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

module.exports = demoTimer
