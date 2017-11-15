const findAdjacentTiles = require('./find-adjacent-tiles.js')
const getValidChannels = require('./get-valid-channels.js')

function moveChargeOneTile(game) {
  let currentChargeCoordinates = game.chargeCoordinates
  let currentlyChargedTile = game.board[game.chargeCoordinates[0]][game.chargeCoordinates[1]]
  let adjacent = findAdjacentTiles(game.board, game.chargeCoordinates)
  let validChannels = getValidChannels(game.board, game.chargeCoordinates)
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
  if (currentChargeCoordinates === game.chargeCoordinates) {
    game.loss = true
  }
  game.chargeCoordinates = currentChargeCoordinates
  return game
}

module.exports = moveChargeOneTile
