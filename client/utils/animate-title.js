let letterIndex = 0
let cycles = 0

function animateTitleForward() {
  if (cycles > 41) {
    let $lastLetter = document.getElementById('span-20')
    if ($lastLetter.classList.length) {
      $lastLetter.classList.remove('charged')
    }
    return
  }
  window.setTimeout(animateTitleForward, 100)
  if (letterIndex === 0) {
    let $lastLetter = document.getElementById('span-20')
    if ($lastLetter.classList.length) {
      $lastLetter.classList.remove('charged')
    }
  }
  if (letterIndex - 1 >= 0) {
    let $lastLetter = document.getElementById('span-' + (letterIndex - 1))
    $lastLetter.classList.remove('charged')
  }
  let $currentLetter = document.getElementById('span-' + letterIndex)
  $currentLetter.classList.add('charged')
  letterIndex++
  if (letterIndex === 21) {
    if (cycles > 40) {
      letterIndex = 20
    }
    else {
      letterIndex = 0
    }
  }
  cycles++
}

function animateTitleBackward() {
  if (cycles < 1) {
    let $lastLetter = document.getElementById('span-0')
    if ($lastLetter.classList.length) {
      $lastLetter.classList.remove('charged')
    }
    return
  }
  window.setTimeout(animateTitleBackward, 100)
  if (letterIndex === 20) {
    let $lastLetter = document.getElementById('span-0')
    if ($lastLetter.classList.length) {
      $lastLetter.classList.remove('charged')
    }
  }
  if (letterIndex + 1 <= 20) {
    let $lastLetter = document.getElementById('span-' + (letterIndex + 1))
    $lastLetter.classList.remove('charged')
  }
  let $currentLetter = document.getElementById('span-' + letterIndex)
  $currentLetter.classList.add('charged')
  letterIndex--
  if (letterIndex === -1) {
    if (cycles === 1) {
      letterIndex = 0
    }
    else {
      letterIndex = 20
    }
  }
  cycles--
}

module.exports = { animateTitleForward, animateTitleBackward }
