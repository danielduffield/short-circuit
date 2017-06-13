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
      $tile.textContent = 'row-' + i + ' column-' + j
      console.log('row-' + i + ' column-' + j)
      if (i === 0 || i === 7 || j === 0 || j === 7) {
        $tile.classList.add('hidden-tile')
      }
      $row.appendChild($tile)
    }
    $board.appendChild($row)
  }
  return $board
}

var $board = generateBoard()
var $start = document.getElementById('start-button')
var $container = document.getElementById('container')

var startGame = function(event) {
  console.log('clicked start')
  document.getElementById('game-board').appendChild($board)
  removeEventListener('click', startGame)
  $container.removeChild($start)
}

$start.addEventListener('click', startGame)
