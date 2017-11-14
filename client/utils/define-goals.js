const shuffleArray = require('./shuffle-array.js')

function defineGoals(candidates) {
  let shuffledCandidates = shuffleArray(candidates)
  let source = shuffledCandidates.pop()
  let sourceCoordinates = [source.originRow, source.originCol]
  let sink = shuffledCandidates.pop()
  let sinkCoordinates = [sink.originRow, sink.originCol]
  let distance = distanceCheck(sourceCoordinates, sinkCoordinates)
  while (distance < 4) {
    sink = shuffledCandidates.pop()
    sinkCoordinates = [sink.originRow, sink.originCol]
    distance = distanceCheck(sourceCoordinates, sinkCoordinates)
  }
  source.channels = {
    north: true,
    south: true,
    east: true,
    west: true
  }
  sink.channels = {
    north: true,
    south: true,
    east: true,
    west: true
  }
  source.chargeStatus.charged = true
  source.source = true
  sink.sink = true
  let sourceAndSink = []
  sourceAndSink.push([source.originRow, source.originCol])
  sourceAndSink.push([sink.originRow, sink.originCol])
  return sourceAndSink
}

function distanceCheck(pointA, pointB) {
  let distance = Math.hypot((pointA[1] - pointB[1]), (pointA[0] - pointB[0]))
  return distance
}

module.exports = defineGoals
