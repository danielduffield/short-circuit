const { isHidden } = require('./is-hidden.js')

function renderBoard(board) {
  let $board = document.createElement('div')
  $board.setAttribute('id', 'board-render')
  for (let i = 0; i < board.length; i++) {
    let $row = renderRow(board[i], i)
    $row.setAttribute('id', 'row-' + i)
    $board.appendChild($row)
  }
  return $board
}

function renderRow(tiles, rowNum) {
  let $row = document.createElement('div')
  $row.setAttribute('class', 'board-row')

  for (let i = 0; i < tiles.length; i++) {
    let $tile = renderTile(tiles[i], rowNum)
    $tile.setAttribute('id', 'row-' + rowNum + ' column-' + i)
    if (!isHidden(tiles[i])) {
      let $tileImage = renderTileImage(tiles[i], $tile)
      if (tiles[i].isSelected === true) {
        $tileImage.classList.add('selected')
      }
      if (tiles[i].chargeStatus.chargeAligned === true) {
        $tile.classList.add('charge-aligned')
        $tileImage.classList.add('charge-aligned')
      }
      if (tiles[i].image === 'dead-tile') {
        $tileImage.classList.add('dead-tile')
        $tile.classList.add('dead-tile')
      }
      if (tiles[i].chargeStatus.charged === true) {
        $tile.classList.add('charged')
        $tileImage.classList.add('charged')
        for (let j = 0; j < 5; j++) {
          if (tiles[i].chargeStatus.chargePhase === j) {
            $tile.classList.add('charge-phase-' + j)
            $tileImage.classList.add('charge-phase-' + j)
          }
        }
      }
      if (tiles[i].chargeStatus.spent === true) {
        $tileImage.classList.add('spent')
        $tile.classList.add('spent')
      }
      $tile.appendChild($tileImage)
    }
    else {
      if (tiles[i].chargeStatus.charged === true) {
        $tile.classList.add('charged')
      }
    }
    $row.appendChild($tile)
  }
  return $row
}

function renderTile(tile, rowNum) {
  let $tile = document.createElement('div')
  $tile.setAttribute('class', 'board-tile')
  if (tile.isHidden === true) {
    $tile.classList.add('hidden-tile')
  }
  if (tile.isSelected === true) {
    $tile.classList.add('selected')
  }
  if (tile.source) {
    if (tile.originRow === 0) {
      $tile.classList.add('source-2')
    }
    if (tile.originRow === 7) {
      $tile.classList.add('source-0')
    }
    if (tile.originCol === 0) {
      $tile.classList.add('source-1')
    }
    if (tile.originCol === 7) {
      $tile.classList.add('source-3')
    }
  }
  if (tile.sink) {
    if (tile.originRow === 0) {
      $tile.classList.add('sink-2')
    }
    if (tile.originRow === 7) {
      $tile.classList.add('sink-0')
    }
    if (tile.originCol === 0) {
      $tile.classList.add('sink-1')
    }
    if (tile.originCol === 7) {
      $tile.classList.add('sink-3')
    }
  }
  $tile.textContent = 'row-' + tile.originRow + ' column-' + tile.originCol
  return $tile
}

function renderTileImage(tile, $tile) {
  let tileStatus = Object.keys(tile.chargeStatus)
  tileStatus = tileStatus.filter(function (key) {
    return tile.chargeStatus[key] === true
  })
  let $tileImage = new Image(75, 75)
  if (tileStatus.length) {
    $tileImage.src = 'images/' + tileStatus + '-' + tile.image + '.png'
  }
  else {
    $tileImage.src = 'images/' + tile.image + '.png'
  }
  $tileImage.classList.add('channel-render')
  $tileImage.setAttribute('id', 'row-' + $tile.id[4] + ' column-' + $tile.id[13] + ' image')
  $tileImage.imageSmoothingEnabled = false
  return $tileImage
}

module.exports = renderBoard
