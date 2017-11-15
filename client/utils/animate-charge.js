const hasClass = require('./has-class.js')

function animateCharge(game, timer) {
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

module.exports = animateCharge
