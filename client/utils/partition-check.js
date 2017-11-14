const findAdjacentTiles = require('./find-adjacent-tiles.js')

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
  let liveTiles = countLiveTiles(board, checkStart)
  let deadTiles = countDeadTiles(board)
  if (liveTiles + deadTiles < 36) {
    return true
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

function countLiveTiles(board, startingPoint) {
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
      let adjacent = findAdjacentTiles(board, currentlyScanningTiles[i])
      for (let j = 0; j < adjacent.length; j++) {
        if (adjacent[j] && countedLiveTiles) {
          if (!(hasBeenCounted(board, adjacent[j], countedLiveTiles) || hasBeenCounted(board, adjacent[j], toBeScanned) || hasBeenCounted(board, adjacent[j], currentlyScanningTiles) || board[adjacent[j][0]][adjacent[j][1]].image === 'dead-tile' || board[adjacent[j][0]][adjacent[j][1]].sink === true)) {
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

function hasBeenCounted(board, tileCoordinates, countedTiles) {
  for (let i = 0; i < countedTiles.length; i++) {
    if (countedTiles[i] && tileCoordinates) {
      if (board[tileCoordinates[0]][tileCoordinates[1]] === board[countedTiles[i][0]][countedTiles[i][1]]) {
        return true
      }
    }
  }
  return false
}

module.exports = partitionCheck
