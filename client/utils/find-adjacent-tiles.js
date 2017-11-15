function findAdjacentTiles(board, coords) {
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
    else if ((currentCoords[0] === 0 || currentCoords[0] === 7 || currentCoords[1] === 0 || currentCoords[1] === 7) &&
      board[currentCoords[0]][currentCoords[1]].sink === true) {
      adjacentTiles.push(currentCoords)
    }
    else {
      adjacentTiles.push(null)
    }
  }
  return adjacentTiles
}

module.exports = findAdjacentTiles
