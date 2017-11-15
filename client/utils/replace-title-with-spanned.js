function replaceTitleWithSpanned($spannedTitle) {
  let $title = document.getElementById('main-title')
  let $titleContainer = document.getElementById('title-container')
  $titleContainer.removeChild($title)
  $titleContainer.appendChild($spannedTitle)
}

module.exports = replaceTitleWithSpanned
