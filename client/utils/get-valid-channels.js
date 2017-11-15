function getValidChannels(board, coordinates) {
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

module.exports = getValidChannels
