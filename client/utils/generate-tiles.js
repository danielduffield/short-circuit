const generateChannel = require('./generate-channel.js')
const isHidden = require('./is-hidden.js')

function generateTiles() {
  let tiles = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let tile = {
        originRow: i,
        originCol: j,
        isSelected: false,
        isHidden: false,
        image: null,
        channels: {
          north: false,
          south: false,
          east: false,
          west: false
        },
        source: false,
        sink: false,
        chargeStatus: {
          charged: false,
          chargePhase: null,
          chargeAligned: false,
          spent: false
        }
      }
      tile.channels = generateChannel(tile)
      if (isHidden(tile)) {
        tile.isHidden = true
        tile.channels = null
      }

      tiles.push(tile)
    }
  }
  return tiles
}

module.exports = generateTiles
