function hasClass(element, clsName) {
  return (' ' + element.className + ' ').indexOf(' ' + clsName + ' ') > -1
}

module.exports = hasClass
