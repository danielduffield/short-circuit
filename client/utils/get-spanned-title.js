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

module.exports = getSpannedTitle
