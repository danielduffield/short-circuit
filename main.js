function generateBoard() {
  var $board = document.createElement('div')
  var rows = 8
  for (let i = 0; i < rows; i++) {
    var $row = document.createElement('div')
    $row.setAttribute('class', 'board-row')
    $row.setAttribute('id', 'row-' + i)
    $row.name = 'column-' + i
    for (let j = 0; j < rows; j++) {
      var $tile = document.createElement('div')
      $tile.setAttribute('class', 'board-tile')
      $tile.setAttribute('id', 'row-' + i + ' column-' + j)
      $row.appendChild($tile)
    }
    $board.appendChild($row)
  }
  return $board
}
