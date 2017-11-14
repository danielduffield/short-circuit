const generateTiles = require('./generate-tiles.js')
const generateBoard = require('./generate-board.js')
const getGoalCandidates = require('./get-goal-candidates.js')
const defineGoals = require('./define-goals.js')

function generateDemoBoard() {
  let demoTiles = generateTiles()
  let demoBoard = generateBoard(demoTiles)
  let demoGoalCandidates = getGoalCandidates(demoBoard)
  defineGoals(demoGoalCandidates)
  return demoBoard
}

module.exports = generateDemoBoard
