function swapTiles(board, coordinates) {
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

module.exports = swapTiles
