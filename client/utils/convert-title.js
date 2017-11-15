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

module.exports = { replaceTitleWithSpanned, replaceSpannedWithTitle }
