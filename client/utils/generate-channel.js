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

module.exports = generateChannel
