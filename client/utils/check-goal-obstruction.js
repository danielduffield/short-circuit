const findAdjacentTiles = require('./find-adjacent-tiles.js')
const generateChannel = require('./generate-channel.js')

function checkGoalObstruction(board, goalCoordinates) {
  for (let i = 0; i < 2; i++) {
    let adjacent = findAdjacentTiles(board, goalCoordinates[i])
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

module.exports = checkGoalObstruction
