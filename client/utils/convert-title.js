function getSpannedTitle() {
  let $title = document.getElementById('main-title')
  let $spannedTitle = document.createElement('h1')
  $spannedTitle.setAttribute('id', 'animated-title')
  let titleText = $title.textContent
  for (let i = 0; i < titleText.length; i++) {
    let $spanLetter = document.createElement('span')
    $spanLetter.setAttribute('id', 'span-' + i)
    $spanLetter.textContent = titleText[i]
    $spanLetter.classList.add('span-title')
    $spannedTitle.appendChild($spanLetter)
  }
  return $spannedTitle
}

function replaceTitleWithSpanned($spannedTitle) {
  let $title = document.getElementById('main-title')
  let $titleContainer = document.getElementById('title-container')
  $titleContainer.removeChild($title)
  $titleContainer.appendChild($spannedTitle)
}

function replaceSpannedWithTitle() {
  let $title = document.createElement('h1')
  let $spannedTitle = document.getElementById('animated-title')
  $title.textContent = '/-/ SH0RT.C1RCU1T /+/'
  $title.setAttribute('id', 'main-title')
  let $titleContainer = document.getElementById('title-container')
  $titleContainer.removeChild($spannedTitle)
  $titleContainer.appendChild($title)
}

function reloadTitle() {
  let $title = document.getElementById('animated-title')
  let $titleContainer = document.getElementById('title-container')
  $titleContainer.removeChild($title)
  $titleContainer.appendChild($title)
}

module.exports = { getSpannedTitle, replaceTitleWithSpanned, replaceSpannedWithTitle, reloadTitle }
